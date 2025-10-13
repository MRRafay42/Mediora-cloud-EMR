// src/app/api/invoices/[id]/pdf/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';
import { generateInvoicePDF } from '@/lib/pdfGenerator';

export async function GET(request, { params }) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    // Await params for Next.js 15+
    const resolvedParams = await params;
    const { id } = resolvedParams;
    
    // Get invoice with items
    const invoice = await db.getInvoiceById(id);

    if (!invoice || invoice.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Get doctor details
    const doctor = await db.getDoctorById(auth.user.id);

    // Generate PDF
    const pdfBuffer = await generateInvoicePDF(invoice, doctor);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_number}.pdf"`,
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Generate invoice PDF error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF: ' + error.message },
      { status: 500 }
    );
  }
}