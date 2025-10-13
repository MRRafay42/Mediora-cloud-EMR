import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter');

    let medicines;
    if (filter === 'low-stock') {
      medicines = await db.getLowStockMedicines(auth.user.id);
    } else {
      medicines = await db.getMedicinesByDoctorId(auth.user.id);
    }

    return NextResponse.json({ medicines }, { status: 200 });
  } catch (error) {
    console.error('Get medicines error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch medicines' },
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
      medicine_name,
      generic_name,
      manufacturer,
      category,
      dosage_form,
      strength,
      unit_price,
      quantity_in_stock,
      reorder_level,
      expiry_date,
      batch_number,
    } = body;

    // Validation
    if (!medicine_name || !unit_price || quantity_in_stock === undefined) {
      return NextResponse.json(
        { error: 'Medicine name, unit price, and quantity are required' },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(unit_price) || unit_price <= 0) {
      return NextResponse.json(
        { error: 'Unit price must be a positive number' },
        { status: 400 }
      );
    }

    if (isNaN(quantity_in_stock) || quantity_in_stock < 0) {
      return NextResponse.json(
        { error: 'Quantity must be a non-negative number' },
        { status: 400 }
      );
    }

    // Create medicine
    const medicine = await db.createMedicine({
      doctor_id: auth.user.id,
      medicine_name,
      generic_name: generic_name || null,
      manufacturer: manufacturer || null,
      category: category || null,
      dosage_form: dosage_form || null,
      strength: strength || null,
      unit_price: parseFloat(unit_price),
      quantity_in_stock: parseInt(quantity_in_stock),
      reorder_level: reorder_level ? parseInt(reorder_level) : 10,
      expiry_date: expiry_date || null,
      batch_number: batch_number || null,
    });

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'create',
      entity_type: 'medicine',
      entity_id: medicine.id,
      details: {
        medicine_name,
        quantity: quantity_in_stock,
      },
    });

    return NextResponse.json(
      {
        message: 'Medicine added successfully',
        medicine,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create medicine error:', error);
    return NextResponse.json(
      { error: 'Failed to add medicine' },
      { status: 500 }
    );
  }
}
