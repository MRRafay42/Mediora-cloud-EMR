// // FILE 1: src/app/api/patients/route.js
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

//     const patients = await db.getPatientsByDoctorId(auth.user.id);

//     return NextResponse.json({ patients }, { status: 200 });
//   } catch (error) {
//     console.error('Get patients error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch patients' },
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
//       full_name,
//       date_of_birth,
//       gender,
//       phone,
//       email,
//       address,
//       blood_group,
//       emergency_contact,
//       emergency_contact_name,
//       medical_history,
//       allergies,
//     } = body;

//     // Validation
//     if (!full_name || !date_of_birth || !gender) {
//       return NextResponse.json(
//         { error: 'Full name, date of birth, and gender are required' },
//         { status: 400 }
//       );
//     }

//     // Create patient
//     const patient = await db.createPatient({
//       doctor_id: auth.user.id,
//       full_name,
//       date_of_birth,
//       gender,
//       phone: phone || null,
//       email: email || null,
//       address: address || null,
//       blood_group: blood_group || null,
//       emergency_contact: emergency_contact || null,
//       emergency_contact_name: emergency_contact_name || null,
//       medical_history: medical_history || null,
//       allergies: allergies || null,
//     });

//     // Create audit log
//     await db.createAuditLog({
//       doctor_id: auth.user.id,
//       action: 'create',
//       entity_type: 'patient',
//       entity_id: patient.id,
//       details: { patient_name: full_name },
//     });

//     return NextResponse.json(
//       {
//         message: 'Patient created successfully',
//         patient,
//       },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Create patient error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create patient' },
//       { status: 500 }
//     );
//   }
// }








// import { NextResponse } from 'next/server';
// import { db } from '@/lib/supabase';
// import { verifyAuth } from '@/lib/auth';

// export async function GET(request) {
//   try {
//     const auth = await verifyAuth(request);

//     // 🧩 Debug Log: what doctor ID is actually being read?
//     console.log('AUTH CHECK:', JSON.stringify(auth, null, 2));

//     if (auth.error) {
//       console.warn('Auth error:', auth.error);
//       return NextResponse.json({ error: auth.error }, { status: auth.status });
//     }

//     const doctorId = auth?.user?.id;
//     if (!doctorId) {
//       console.warn('No doctor ID in token');
//       return NextResponse.json(
//         { error: 'Invalid authentication data' },
//         { status: 401 }
//       );
//     }

//     console.log('Fetching patients for doctor_id:', doctorId);

//     // ✅ Fetch doctor-specific patients
//     const patients = await db.getPatientsByDoctorId(doctorId);

//     console.log('Found patients:', patients?.length || 0);

//     return NextResponse.json({ patients }, { status: 200 });
//   } catch (error) {
//     console.error('Get patients error:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch patients' },
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

//     const doctorId = auth.user.id;
//     const body = await request.json();
//     const {
//       full_name,
//       date_of_birth,
//       gender,
//       phone,
//       email,
//       address,
//       blood_group,
//       emergency_contact,
//       emergency_contact_name,
//       medical_history,
//       allergies,
//     } = body;

//     // Validation
//     if (!full_name || !date_of_birth || !gender) {
//       return NextResponse.json(
//         { error: 'Full name, date of birth, and gender are required' },
//         { status: 400 }
//       );
//     }

//     // ✅ Create patient with correct doctor ID
//     const patient = await db.createPatient({
//       doctor_id: doctorId,
//       full_name,
//       date_of_birth,
//       gender,
//       phone: phone || null,
//       email: email || null,
//       address: address || null,
//       blood_group: blood_group || null,
//       emergency_contact: emergency_contact || null,
//       emergency_contact_name: emergency_contact_name || null,
//       medical_history: medical_history || null,
//       allergies: allergies || null,
//     });

//     await db.createAuditLog({
//       doctor_id: doctorId,
//       action: 'create',
//       entity_type: 'patient',
//       entity_id: patient.id,
//       details: { patient_name: full_name },
//     });

//     return NextResponse.json(
//       { message: 'Patient created successfully', patient },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('Create patient error:', error);
//     return NextResponse.json(
//       { error: 'Failed to create patient' },
//       { status: 500 }
//     );
//   }
// }









// src/app/api/patients/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/supabase';
import { verifyAuth } from '@/lib/auth';

export async function GET(request) {
  try {
    // 🔍 Debug: Log incoming headers to see if token is being sent
    console.log('🔍 Request headers:', Object.fromEntries(request.headers.entries()));

    // ✅ Verify JWT Token
    const auth = await verifyAuth(request);

    if (auth.error) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const doctorId = auth?.user?.id;
    if (!doctorId) {
      return NextResponse.json(
        { error: 'Invalid authentication data' },
        { status: 401 }
      );
    }

    console.log('🔍 Fetching patients for doctor_id:', doctorId);

    const patients = await db.getPatientsByDoctorId(doctorId);
    console.log('✅ Found patients:', patients?.length || 0);

    return NextResponse.json({ patients }, { status: 200 });
  } catch (error) {
    console.error('❌ Get patients error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patients' },
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

    const doctorId = auth.user.id;
    const body = await request.json();
    const {
      full_name,
      date_of_birth,
      gender,
      phone,
      email,
      address,
      blood_group,
      emergency_contact,
      emergency_contact_name,
      medical_history,
      allergies,
    } = body;

    if (!full_name || !date_of_birth || !gender) {
      return NextResponse.json(
        { error: 'Full name, date of birth, and gender are required' },
        { status: 400 }
      );
    }

    const patient = await db.createPatient({
      doctor_id: doctorId,
      full_name,
      date_of_birth,
      gender,
      phone: phone || null,
      email: email || null,
      address: address || null,
      blood_group: blood_group || null,
      emergency_contact: emergency_contact || null,
      emergency_contact_name: emergency_contact_name || null,
      medical_history: medical_history || null,
      allergies: allergies || null,
    });

    await db.createAuditLog({
      doctor_id: doctorId,
      action: 'create',
      entity_type: 'patient',
      entity_id: patient.id,
      details: { patient_name: full_name },
    });

    return NextResponse.json(
      { message: 'Patient created successfully', patient },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Create patient error:', error);
    return NextResponse.json(
      { error: 'Failed to create patient' },
      { status: 500 }
    );
  }
}
