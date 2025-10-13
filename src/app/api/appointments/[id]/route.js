// src/app/api/appointments/[id]/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const { data: appointment, error } = await db.supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*)
      `)
      .eq('id', params.id)
      .single();

    if (error || !appointment || appointment.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ appointment }, { status: 200 });
  } catch (error) {
    console.error('Get appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointment' },
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

    const appointment = await db.updateAppointment(params.id, body);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'update',
      entity_type: 'appointment',
      entity_id: appointment.id,
      details: { status: body.status },
    });

    return NextResponse.json(
      {
        message: 'Appointment updated successfully',
        appointment,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to update appointment' },
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

    await db.deleteAppointment(params.id);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'delete',
      entity_type: 'appointment',
      entity_id: params.id,
    });

    return NextResponse.json(
      { message: 'Appointment deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    );
  }
}