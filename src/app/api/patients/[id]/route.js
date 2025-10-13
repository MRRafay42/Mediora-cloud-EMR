// FILE 2: src/app/api/patients/[id]/route.js
// ============================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const patient = await db.getPatientById(params.id);

    if (!patient || patient.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ patient }, { status: 200 });
  } catch (error) {
    console.error('Get patient error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient' },
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
    const existingPatient = await db.getPatientById(params.id);
    if (!existingPatient || existingPatient.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Update patient
    const patient = await db.updatePatient(params.id, body);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'update',
      entity_type: 'patient',
      entity_id: patient.id,
      details: { patient_name: patient.full_name },
    });

    return NextResponse.json(
      {
        message: 'Patient updated successfully',
        patient,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update patient error:', error);
    return NextResponse.json(
      { error: 'Failed to update patient' },
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
    const existingPatient = await db.getPatientById(params.id);
    if (!existingPatient || existingPatient.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    await db.deletePatient(params.id);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'delete',
      entity_type: 'patient',
      entity_id: params.id,
      details: { patient_name: existingPatient.full_name },
    });

    return NextResponse.json(
      { message: 'Patient deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete patient error:', error);
    return NextResponse.json(
      { error: 'Failed to delete patient' },
      { status: 500 }
    );
  }
}