// FILE 1: src/app/api/invoices/route.js
// ============================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const invoices = await db.getInvoicesByDoctorId(auth.user.id);

    return NextResponse.json({ invoices }, { status: 200 });
  } catch (error) {
    console.error('Get invoices error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const {
      patient_id,
      prescription_id,
      items,
      tax_amount,
      discount_amount,
      payment_method,
      notes,
    } = body;

    // Validation
    if (!patient_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Patient and invoice items are required' },
        { status: 400 }
      );
    }

    // Verify patient belongs to doctor
    const patient = await db.getPatientById(patient_id);
    if (!patient || patient.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Invalid patient' },
        { status: 400 }
      );
    }

    // Validate all items have required fields
    for (const item of items) {
      if (!item.medicine_id || !item.item_name || !item.quantity || !item.unit_price) {
        return NextResponse.json(
          { error: 'Each item must have medicine_id, item_name, quantity, and unit_price' },
          { status: 400 }
        );
      }

      // Validate numeric fields
      if (isNaN(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.item_name}` },
          { status: 400 }
        );
      }

      if (isNaN(item.unit_price) || item.unit_price <= 0) {
        return NextResponse.json(
          { error: `Invalid price for ${item.item_name}` },
          { status: 400 }
        );
      }
    }

    // Check inventory availability for all items
    for (const item of items) {
      const { data: medicine } = await db.supabase
        .from('medicine_inventory')
        .select('quantity_in_stock, medicine_name')
        .eq('id', item.medicine_id)
        .single();

      if (!medicine) {
        return NextResponse.json(
          { error: `Medicine not found: ${item.item_name}` },
          { status: 400 }
        );
      }

      if (medicine.quantity_in_stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${medicine.medicine_name}. Available: ${medicine.quantity_in_stock}, Required: ${item.quantity}` },
          { status: 400 }
        );
      }
    }

    // Calculate item totals
    const processedItems = items.map(item => ({
      medicine_id: item.medicine_id,
      item_name: item.item_name,
      quantity: parseInt(item.quantity),
      unit_price: parseFloat(item.unit_price),
      total_price: parseInt(item.quantity) * parseFloat(item.unit_price),
    }));

    // Calculate totals
    const subtotal = processedItems.reduce((sum, item) => sum + item.total_price, 0);
    const taxAmount = tax_amount ? parseFloat(tax_amount) : 0;
    const discountAmount = discount_amount ? parseFloat(discount_amount) : 0;
    const total_amount = subtotal + taxAmount - discountAmount;

    // Create invoice and update inventory
    const invoice = await db.createInvoice(
      {
        doctor_id: auth.user.id,
        patient_id,
        prescription_id: prescription_id || null,
        invoice_date: new Date().toISOString().split('T')[0],
        subtotal,
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        total_amount,
        payment_status: 'paid',
        payment_method: payment_method || 'cash',
        notes: notes || null,
      },
      processedItems
    );

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'create',
      entity_type: 'invoice',
      entity_id: invoice.id,
      details: {
        patient_name: patient.full_name,
        total_amount,
        items_count: processedItems.length,
        invoice_number: invoice.invoice_number,
      },
    });

    return NextResponse.json(
      {
        message: 'Invoice created successfully',
        invoice,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}