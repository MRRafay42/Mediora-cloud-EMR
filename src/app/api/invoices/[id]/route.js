// FILE 2: src/app/api/invoices/[id]/route.js
// ============================================================

// import { NextResponse } from 'next/server';
// import { db } from '@/lib/supabase';
// import { verifyAuth } from '@/lib/auth';

// export async function GET(request, { params }) {
//   try {
//     const auth = await verifyAuth(request);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     const invoice = await db.getInvoiceById(params.id);

//     if (!invoice || invoice.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Invoice not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ invoice }, { status: 200 });
//   } catch (error) {
//     console.error('Get invoice error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch invoice' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request, { params }) {
//   try {
//     const auth = await verifyAuth(request);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     const body = await request.json();

//     // Verify ownership
//     const existingInvoice = await db.getInvoiceById(params.id);

//     if (!existingInvoice || existingInvoice.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Invoice not found' },
//         { status: 404 }
//       );
//     }

//     // Validate payment status if provided
//     if (body.payment_status) {
//       const validStatuses = ['pending', 'paid', 'partially_paid', 'cancelled'];
//       if (!validStatuses.includes(body.payment_status)) {
//         return NextResponse.json(
//           { error: 'Invalid payment status' },
//           { status: 400 }
//         );
//       }
//     }

//     // Update invoice
//     const invoice = await db.updateInvoice(params.id, body);

//     // Create audit log
//     await db.createAuditLog({
//       doctor_id: auth.user.id,
//       action: 'update',
//       entity_type: 'invoice',
//       entity_id: invoice.id,
//       details: { 
//         payment_status: body.payment_status,
//         updated_fields: Object.keys(body),
//       },
//     });

//     return NextResponse.json(
//       {
//         message: 'Invoice updated successfully',
//         invoice,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Update invoice error:', error);
//     return NextResponse.json(
//       { error: 'Failed to update invoice' },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(request, { params }) {
//   try {
//     const auth = await verifyAuth(request);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     // Verify ownership
//     const existingInvoice = await db.getInvoiceById(params.id);

//     if (!existingInvoice || existingInvoice.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Invoice not found' },
//         { status: 404 }
//       );
//     }

//     // Warning: Deleting an invoice does NOT restore inventory
//     // This is intentional - once medicines are given to patient, they're gone
//     // If you need to restore inventory, you'd need additional logic here

//     const { error } = await db.supabase
//       .from('invoices')
//       .delete()
//       .eq('id', params.id);

//     if (error) throw error;

//     // Create audit log
//     await db.createAuditLog({
//       doctor_id: auth.user.id,
//       action: 'delete',
//       entity_type: 'invoice',
//       entity_id: params.id,
//       details: {
//         invoice_number: existingInvoice.invoice_number,
//         total_amount: existingInvoice.total_amount,
//       },
//     });

//     return NextResponse.json(
//       { message: 'Invoice deleted successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Delete invoice error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete invoice' },
//       { status: 500 }
//     );
//   }
// }


// made with rafay40


/// FILE 4: src/app/api/invoices/[id]/route.js (FIXED)
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

    // Await params for Next.js 15+
    const { id } = await params;
    const invoice = await db.getInvoiceById(id);

    if (!invoice || invoice.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ invoice }, { status: 200 });
  } catch (error) {
    console.error('Get invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invoice' },
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

    // Await params for Next.js 15+
    const { id } = await params;

    // Verify ownership
    const existingInvoice = await db.getInvoiceById(id);

    if (!existingInvoice || existingInvoice.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Validate payment status if provided
    if (body.payment_status) {
      const validStatuses = ['pending', 'paid', 'partially_paid', 'cancelled'];
      if (!validStatuses.includes(body.payment_status)) {
        return NextResponse.json(
          { error: 'Invalid payment status' },
          { status: 400 }
        );
      }
    }

    // Prepare update data (only allow certain fields to be updated)
    const updateData = {};
    
    if (body.payment_method) updateData.payment_method = body.payment_method;
    if (body.payment_status) updateData.payment_status = body.payment_status;
    if (body.tax_amount !== undefined) {
      updateData.tax_amount = parseFloat(body.tax_amount);
      const subtotal = existingInvoice.subtotal;
      const discount = body.discount_amount !== undefined ? parseFloat(body.discount_amount) : existingInvoice.discount_amount;
      updateData.total_amount = subtotal + updateData.tax_amount - discount;
    }
    if (body.discount_amount !== undefined) {
      updateData.discount_amount = parseFloat(body.discount_amount);
      const subtotal = existingInvoice.subtotal;
      const tax = body.tax_amount !== undefined ? parseFloat(body.tax_amount) : existingInvoice.tax_amount;
      updateData.total_amount = subtotal + tax - updateData.discount_amount;
    }
    if (body.notes !== undefined) updateData.notes = body.notes;

    // Update invoice
    const invoice = await db.updateInvoice(id, updateData);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'update',
      entity_type: 'invoice',
      entity_id: invoice.id,
      details: { 
        updated_fields: Object.keys(updateData),
        invoice_number: invoice.invoice_number,
      },
    });

    // Fetch complete invoice with items
    const completeInvoice = await db.getInvoiceById(id);

    return NextResponse.json(
      {
        message: 'Invoice updated successfully',
        invoice: completeInvoice,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
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

    // Await params for Next.js 15+
    const { id } = await params;

    // Verify ownership
    const existingInvoice = await db.getInvoiceById(id);

    if (!existingInvoice || existingInvoice.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    // Check if invoice can be deleted
    if (existingInvoice.payment_status === 'paid') {
      return NextResponse.json(
        { error: 'Cannot delete a paid invoice. Please cancel it instead.' },
        { status: 400 }
      );
    }

    // Delete invoice items first
    const { error: itemsError } = await db.supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);

    if (itemsError) throw itemsError;

    // Delete invoice
    const { error } = await db.supabase
      .from('invoices')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'delete',
      entity_type: 'invoice',
      entity_id: id,
      details: {
        invoice_number: existingInvoice.invoice_number,
        total_amount: existingInvoice.total_amount,
        patient_name: existingInvoice.patient?.full_name,
      },
    });

    return NextResponse.json(
      { message: 'Invoice deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json(
      { error: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}