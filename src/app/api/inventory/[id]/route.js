//api/inventory/id//route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: medicine, error } = await db.supabase
      .from('medicine_inventory')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error || !medicine || medicine.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ medicine }, { status: 200 });
  } catch (error) {
    console.error('Get medicine error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicine' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const body = await request.json();

    // Verify ownership
    const { data: existingMedicine } = await db.supabase
      .from('medicine_inventory')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!existingMedicine || existingMedicine.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Validate numeric fields if they're being updated
    if (body.unit_price !== undefined) {
      const price = parseFloat(body.unit_price);
      if (isNaN(price) || price <= 0) {
        return NextResponse.json(
          { error: 'Unit price must be a positive number' },
          { status: 400 }
        );
      }
      body.unit_price = price;
    }

    if (body.quantity_in_stock !== undefined) {
      const quantity = parseInt(body.quantity_in_stock);
      if (isNaN(quantity) || quantity < 0) {
        return NextResponse.json(
          { error: 'Quantity must be a non-negative number' },
          { status: 400 }
        );
      }
      body.quantity_in_stock = quantity;
    }

    if (body.reorder_level !== undefined) {
      const reorderLevel = parseInt(body.reorder_level);
      if (isNaN(reorderLevel) || reorderLevel < 0) {
        return NextResponse.json(
          { error: 'Reorder level must be a non-negative number' },
          { status: 400 }
        );
      }
      body.reorder_level = reorderLevel;
    }

    // Update medicine
    const medicine = await db.updateMedicine(params.id, body);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'update',
      entity_type: 'medicine',
      entity_id: medicine.id,
      details: {
        medicine_name: medicine.medicine_name,
        quantity: medicine.quantity_in_stock,
        updated_fields: Object.keys(body),
      },
    });

    return NextResponse.json(
      {
        message: 'Medicine updated successfully',
        medicine,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update medicine error:', error);
    return NextResponse.json(
      { error: 'Failed to update medicine' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Verify ownership
    const { data: existingMedicine } = await db.supabase
      .from('medicine_inventory')
      .select('*')
      .eq('id', params.id)
      .single();

    if (!existingMedicine || existingMedicine.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Medicine not found' },
        { status: 404 }
      );
    }

    // Check if medicine is used in any prescriptions or invoices
    const { data: prescriptionItems } = await db.supabase
      .from('prescription_items')
      .select('id')
      .eq('medicine_id', params.id)
      .limit(1);

    const { data: invoiceItems } = await db.supabase
      .from('invoice_items')
      .select('id')
      .eq('medicine_id', params.id)
      .limit(1);

    if (prescriptionItems?.length > 0 || invoiceItems?.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete medicine that is referenced in prescriptions or invoices' },
        { status: 400 }
      );
    }

    await db.deleteMedicine(params.id);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'delete',
      entity_type: 'medicine',
      entity_id: params.id,
      details: { medicine_name: existingMedicine.medicine_name },
    });

    return NextResponse.json(
      { message: 'Medicine deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete medicine error:', error);
    return NextResponse.json(
      { error: 'Failed to delete medicine' },
      { status: 500 }
    );
  }
}