// FILE 4: src/app/api/prescriptions/[id]/pdf/route.js
// ============================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';
import { generatePrescriptionPDF } from '@/lib/pdfGenerator';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Await params for Next.js 15+
    const { id } = await params;
    const prescription = await db.getPrescriptionById(id);

    if (!prescription || prescription.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Get doctor details
    const doctor = await db.getDoctorById(auth.user.id);

    // Generate PDF
    const pdfBuffer = await generatePrescriptionPDF(prescription, doctor);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="prescription-${id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Generate prescription PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}