// src/app/api/auth/login/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { authUtils } from '@/lib/auth';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Get doctor by email
    const doctor = await db.getDoctorByEmail(email);
    if (!doctor) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await authUtils.comparePassword(
      password,
      doctor.password_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
      action: 'login',
      entity_type: 'auth',
      details: { email: doctor.email },
    });

    return NextResponse.json(
      {
        message: 'Login successful',
        doctor: doctorWithoutPassword,
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to login' },
      { status: 500 }
    );
  }
}