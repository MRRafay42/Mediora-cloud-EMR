// src/app/api/appointments/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const appointments = await db.getAppointmentsByDoctorId(auth.user.id);

    return NextResponse.json({ appointments }, { status: 200 });
  } catch (error) {
    console.error('Get appointments error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
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
      appointment_date,
      appointment_time,
      duration_minutes,
      reason,
      notes,
    } = body;

    // Validation
    if (!patient_id || !appointment_date || !appointment_time) {
      return NextResponse.json(
        { error: 'Patient, date, and time are required' },
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

    // Create appointment
    const appointment = await db.createAppointment({
      doctor_id: auth.user.id,
      patient_id,
      appointment_date,
      appointment_time,
      duration_minutes: duration_minutes || 30,
      status: 'scheduled',
      reason,
      notes,
    });

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'create',
      entity_type: 'appointment',
      entity_id: appointment.id,
      details: {
        patient_name: appointment.patient?.full_name,
        date: appointment_date,
        time: appointment_time,
      },
    });

    return NextResponse.json(
      {
        message: 'Appointment created successfully',
        appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create appointment error:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}