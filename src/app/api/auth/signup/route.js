// src/app/api/auth/signup/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { authUtils } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, full_name, specialization, license_number, phone } = body;

    // Validation
    if (!email || !password || !full_name) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      );
    }

    if (!authUtils.isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!authUtils.isValidPassword(password)) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if doctor already exists
    const existingDoctor = await db.getDoctorByEmail(email);
    if (existingDoctor) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await authUtils.hashPassword(password);

    // Create doctor
    const doctor = await db.createDoctor({
      email,
      password_hash,
      full_name,
      specialization: specialization || null,
      license_number: license_number || null,
      phone: phone || null,
    });

    // Generate token
    const token = authUtils.generateToken({
      id: doctor.id,
      email: doctor.email,
      full_name: doctor.full_name,
    });

    // Remove password hash from response
    const { password_hash: _, ...doctorWithoutPassword } = doctor;

    // Create audit log
    await db.createAuditLog({
      doctor_id: doctor.id,
      action: 'signup',
      entity_type: 'auth',
      details: { email: doctor.email },
    });

    return NextResponse.json(
      {
        message: 'Doctor registered successfully',
        doctor: doctorWithoutPassword,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to register doctor' },
      { status: 500 }
    );
  }
}