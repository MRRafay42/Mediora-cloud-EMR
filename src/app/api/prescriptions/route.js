// // ============================================================
// // FILE 1: src/app/api/prescriptions/route.js
// // ============================================================

// import { NextResponse } from 'next/server';
// import { db } from '@/lib/supabase';
// import { verifyAuth } from '@/lib/auth';

// export async function GET(request) {
//   try {
//     const auth = await verifyAuth(request);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     const prescriptions = await db.getPrescriptionsByDoctorId(auth.user.id);

//     return NextResponse.json({ prescriptions }, { status: 200 });
//   } catch (error) {
//     console.error('Get prescriptions error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch prescriptions' },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request) {
//   try {
//     const auth = await verifyAuth(request);
//     if (auth.error) {
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     const body = await request.json();
//     const {
//       patient_id,
//       appointment_id,
//       diagnosis,
//       symptoms,
//       vital_signs,
//       notes,
//       follow_up_date,
//       items,
//     } = body;

//     // Validation
//     if (!patient_id || !items || items.length === 0) {
//       return NextResponse.json(
//         { error: 'Patient and prescription items are required' },
//         { status: 400 }
//       );
//     }

//     // Verify patient belongs to doctor
//     const patient = await db.getPatientById(patient_id);
//     if (!patient || patient.doctor_id !== auth.user.id) {
//       return NextResponse.json(
//         { error: 'Invalid patient' },
//         { status: 400 }
//       );
//     }

//     // Validate all items have required fields
//     for (const item of items) {
//       if (!item.medicine_id || !item.medicine_name || !item.dosage || !item.frequency || !item.duration || !item.quantity) {
//         return NextResponse.json(
//           { error: 'Each prescription item must have medicine_id, medicine_name, dosage, frequency, duration, and quantity' },
//           { status: 400 }
//         );
//       }

//       // Validate quantity is a positive number
//       if (isNaN(item.quantity) || item.quantity <= 0) {
//         return NextResponse.json(
//           { error: `Invalid quantity for ${item.medicine_name}` },
//           { status: 400 }
//         );
//       }
//     }

//     // Verify all medicines exist in inventory
//     for (const item of items) {
//       const { data: medicine } = await db.supabase
//         .from('medicine_inventory')
//         .select('id, medicine_name, quantity_in_stock')
//         .eq('id', item.medicine_id)
//         .single();

//       if (!medicine) {
//         return NextResponse.json(
//           { error: `Medicine not found in inventory: ${item.medicine_name}` },
//           { status: 400 }
//         );
//       }

//       // Optional: Check if enough stock available (warning only)
//       if (medicine.quantity_in_stock < item.quantity) {
//         console.warn(`Warning: Insufficient stock for ${medicine.medicine_name}. Available: ${medicine.quantity_in_stock}, Prescribed: ${item.quantity}`);
//       }
//     }

//     // Process items
//     const processedItems = items.map(item => ({
//       medicine_id: item.medicine_id,
//       medicine_name: item.medicine_name,
//       dosage: item.dosage,
//       frequency: item.frequency,
//       duration: item.duration,
//       quantity: parseInt(item.quantity),
//       instructions: item.instructions || null,
//     }));

//     // Create prescription
//     const prescription = await db.createPrescription(
//       {
//         doctor_id: auth.user.id,
//         patient_id,
//         appointment_id: appointment_id || null,
//         prescription_date: new Date().toISOString().split('T')[0],
//         diagnosis: diagnosis || null,
//         symptoms: symptoms || null,
//         vital_signs: vital_signs || null,
//         notes: notes || null,
//         follow_up_date: follow_up_date || null,
//       },
//       processedItems
//     );

//     // Create audit log
//     await db.createAuditLog({
//       doctor_id: auth.user.id,
//       action: 'create',
//       entity_type: 'prescription',
//       entity_id: prescription.id,
//       details: {
//         patient_name: patient.full_name,
//         medicines_count: processedItems.length,
//         diagnosis: diagnosis,
//       },
//     });

//     return NextResponse.json(
//       {
//         message: 'Prescription created successfully',
//         prescription,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Create prescription error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create prescription' },
//       { status: 500 }
//     );
//   }
// }



// made with rafay40

// FILE 2: src/app/api/prescriptions/route.js
// ============================================================

import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await verifyAuth(request);
    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const prescriptions = await db.getPrescriptionsByDoctorId(auth.user.id);

    return NextResponse.json({ prescriptions }, { status: 200 });
  } catch (error) {
    console.error('Get prescriptions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prescriptions' },
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
      appointment_id,
      diagnosis,
      symptoms,
      vital_signs,
      notes,
      follow_up_date,
      items,
    } = body;

    // Validation
    if (!patient_id || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Patient and prescription items are required' },
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

    // Validate all items have required fields
    for (const item of items) {
      if (!item.medicine_id || !item.medicine_name || !item.dosage || !item.frequency || !item.duration || !item.quantity) {
        return NextResponse.json(
          { error: 'Each prescription item must have medicine_id, medicine_name, dosage, frequency, duration, and quantity' },
          { status: 400 }
        );
      }

      // Validate quantity is a positive number
      if (isNaN(item.quantity) || item.quantity <= 0) {
        return NextResponse.json(
          { error: `Invalid quantity for ${item.medicine_name}` },
          { status: 400 }
        );
      }
    }

    // Verify all medicines exist in inventory
    for (const item of items) {
      const { data: medicine } = await db.supabase
        .from('medicine_inventory')
        .select('id, medicine_name, quantity_in_stock')
        .eq('id', item.medicine_id)
        .single();

      if (!medicine) {
        return NextResponse.json(
          { error: `Medicine not found in inventory: ${item.medicine_name}` },
          { status: 400 }
        );
      }

      // Optional: Check if enough stock available (warning only)
      if (medicine.quantity_in_stock < item.quantity) {
        console.warn(`Warning: Insufficient stock for ${medicine.medicine_name}. Available: ${medicine.quantity_in_stock}, Prescribed: ${item.quantity}`);
      }
    }

    // Process items
    const processedItems = items.map(item => ({
      medicine_id: item.medicine_id,
      medicine_name: item.medicine_name,
      dosage: item.dosage,
      frequency: item.frequency,
      duration: item.duration,
      quantity: parseInt(item.quantity),
      instructions: item.instructions || null,
    }));

    // Create prescription
    const prescription = await db.createPrescription(
      {
        doctor_id: auth.user.id,
        patient_id,
        appointment_id: appointment_id || null,
        prescription_date: new Date().toISOString().split('T')[0],
        diagnosis: diagnosis || null,
        symptoms: symptoms || null,
        vital_signs: vital_signs || null,
        notes: notes || null,
        follow_up_date: follow_up_date || null,
      },
      processedItems
    );

    // Create audit log
    await db.createAuditLog({
      doctor_id: auth.user.id,
      action: 'create',
      entity_type: 'prescription',
      entity_id: prescription.id,
      details: {
        patient_name: patient.full_name,
        medicines_count: processedItems.length,
        diagnosis: diagnosis,
      },
    });

    return NextResponse.json(
      {
        message: 'Prescription created successfully',
        prescription,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create prescription error:', error);
    return NextResponse.json(
      { error: 'Failed to create prescription' },
      { status: 500 }
    );
  }
}