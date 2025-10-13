// // FILE 2: src/app/api/prescriptions/[id]/route.js
// // ============================================================

// import { NextResponse } from 'next/server';
// import { db } from '@/lib/supabase';
// import { verifyAuth } from '@/lib/auth';

// export async function GET(request, { params }) {
//   try {
//     const auth = await verifyAuth(request);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     const prescription = await db.getPrescriptionById(params.id);

//     if (!prescription || prescription.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Prescription not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ prescription }, { status: 200 });
//   } catch (error) {
//     console.error('Get prescription error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch prescription' },
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
//     const existingPrescription = await db.getPrescriptionById(params.id);

//     if (!existingPrescription || existingPrescription.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Prescription not found' },
//         { status: 404 }
//       );
//     }

//     // Update prescription (main record only, not items)
//     const { error } = await db.supabase
//       .from('prescriptions')
//       .update(body)
//       .eq('id', params.id);

//     if (error) throw error;

//     // Fetch updated prescription
//     const updatedPrescription = await db.getPrescriptionById(params.id);

//     // Create audit log
//     await db.createAuditLog({
//       doctor_id: auth.user.id,
//       action: 'update',
//       entity_type: 'prescription',
//       entity_id: params.id,
//       details: {
//         updated_fields: Object.keys(body),
//       },
//     });

//     return NextResponse.json(
//       {
//         message: 'Prescription updated successfully',
//         prescription: updatedPrescription,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Update prescription error:', error);
//     return NextResponse.json(
//       { error: 'Failed to update prescription' },
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
//     const existingPrescription = await db.getPrescriptionById(params.id);

//     if (!existingPrescription || existingPrescription.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Prescription not found' },
//         { status: 404 }
//       );
//     }

//     // Check if prescription is linked to any invoices
//     const { data: invoices } = await db.supabase
//       .from('invoices')
//       .select('id, invoice_number')
//       .eq('prescription_id', params.id)
//       .limit(1);

//     if (invoices && invoices.length > 0) {
//       return NextResponse.json(
//         { error: 'Cannot delete prescription that is linked to invoices. Please delete the invoices first.' },
//         { status: 400 }
//       );
//     }

//     // Delete prescription (prescription_items will be cascade deleted)
//     const { error } = await db.supabase
//       .from('prescriptions')
//       .delete()
//       .eq('id', params.id);

//     if (error) throw error;

//     // Create audit log
//     await db.createAuditLog({
//       doctor_id: auth.user.id,
//       action: 'delete',
//       entity_type: 'prescription',
//       entity_id: params.id,
//       details: {
//         patient_name: existingPrescription.patient?.full_name,
//       },
//     });

//     return NextResponse.json(
//       { message: 'Prescription deleted successfully' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Delete prescription error:', error);
//     return NextResponse.json(
//       { error: 'Failed to delete prescription' },
//       { status: 500 }
//     );
//   }
// }

// made with rafay40
// FILE 3: src/app/api/prescriptions/[id]/route.js
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

    const prescription = await db.getPrescriptionById(params.id);

    if (!prescription || prescription.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ prescription }, { status: 200 });
  } catch (error) {
    console.error('Get prescription error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescription' },
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
    const existingPrescription = await db.getPrescriptionById(params.id);

    if (!existingPrescription || existingPrescription.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Check if prescription is linked to invoices
    const { data: invoices } = await db.supabase
      .from('invoices')
      .select('id')
      .eq('prescription_id', params.id)
      .limit(1);

    if (invoices && invoices.length > 0) {
      return NextResponse.json(
        { error: 'Cannot edit prescription that is linked to invoices' },
        { status: 400 }
      );
    }

    // Prepare update data (only metadata, not items)
    const updateData = {};
    if (body.diagnosis !== undefined) updateData.diagnosis = body.diagnosis;
    if (body.symptoms !== undefined) updateData.symptoms = body.symptoms;
    if (body.vital_signs !== undefined) updateData.vital_signs = body.vital_signs;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.follow_up_date !== undefined) updateData.follow_up_date = body.follow_up_date;

    // Update prescription (main record only)
    const { error } = await db.supabase
      .from('prescriptions')
      .update(updateData)
      .eq('id', params.id);

    if (error) throw error;

    // Fetch updated prescription
    const updatedPrescription = await db.getPrescriptionById(params.id);

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'update',
      entity_type: 'prescription',
      entity_id: params.id,
      details: {
        updated_fields: Object.keys(updateData),
        patient_name: updatedPrescription.patient?.full_name,
      },
    });

    return NextResponse.json(
      {
        message: 'Prescription updated successfully',
        prescription: updatedPrescription,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update prescription error:', error);
    return NextResponse.json(
      { error: 'Failed to update prescription' },
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
    const existingPrescription = await db.getPrescriptionById(params.id);

    if (!existingPrescription || existingPrescription.doctor_id !== auth.user.id) {
      return NextResponse.json(
        { error: 'Prescription not found' },
        { status: 404 }
      );
    }

    // Check if prescription is linked to any invoices
    const { data: invoices } = await db.supabase
      .from('invoices')
      .select('id, invoice_number')
      .eq('prescription_id', params.id)
      .limit(1);

    if (invoices && invoices.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete prescription that is linked to invoices. Please delete the invoices first.' },
        { status: 400 }
      );
    }

    // Delete prescription items first
    const { error: itemsError } = await db.supabase
      .from('prescription_items')
      .delete()
      .eq('prescription_id', params.id);

    if (itemsError) throw itemsError;

    // Delete prescription
    const { error } = await db.supabase
      .from('prescriptions')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'delete',
      entity_type: 'prescription',
      entity_id: params.id,
      details: {
        patient_name: existingPrescription.patient?.full_name,
        diagnosis: existingPrescription.diagnosis,
      },
    });

    return NextResponse.json(
      { message: 'Prescription deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete prescription error:', error);
    return NextResponse.json(
      { error: 'Failed to delete prescription' },
      { status: 500 }
    );
  }
}