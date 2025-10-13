// // src/lib/supabase.js
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// if (!supabaseUrl || !supabaseAnonKey) {
//   throw new Error('Missing Supabase environment variables');
// }

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     persistSession: false,
//     autoRefreshToken: false,
//   },
// });

// // Database helper functions
// export const db = {

//   supabase: supabase,
//   // Doctors
//   async createDoctor(doctor) {
//     const { data, error } = await supabase
//       .from('doctors')
//       .insert([doctor])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async getDoctorByEmail(email) {
//     const { data, error } = await supabase
//       .from('doctors')
//       .select('*')
//       .eq('email', email)
//       .single();
    
//     if (error && error.code !== 'PGRST116') throw error;
//     return data;
//   },

//   async getDoctorById(id) {
//     const { data, error } = await supabase
//       .from('doctors')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   // Patients
//   async createPatient(patient) {
//     const { data, error } = await supabase
//       .from('patients')
//       .insert([patient])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async getPatientsByDoctorId(doctorId) {
//     const { data, error } = await supabase
//       .from('patients')
//       .select('*')
//       .eq('doctor_id', doctorId)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   },

//   async getPatientById(id) {
//     const { data, error } = await supabase
//       .from('patients')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async updatePatient(id, updates) {
//     const { data, error } = await supabase
//       .from('patients')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async deletePatient(id) {
//     const { error } = await supabase
//       .from('patients')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   },

//   // Appointments
//   async createAppointment(appointment) {
//     const { data, error } = await supabase
//       .from('appointments')
//       .insert([appointment])
//       .select(`
//         *,
//         patient:patients(*)
//       `)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async getAppointmentsByDoctorId(doctorId) {
//     const { data, error } = await supabase
//       .from('appointments')
//       .select(`
//         *,
//         patient:patients(*)
//       `)
//       .eq('doctor_id', doctorId)
//       .order('appointment_date', { ascending: true })
//       .order('appointment_time', { ascending: true });
    
//     if (error) throw error;
//     return data;
//   },

//   async updateAppointment(id, updates) {
//     const { data, error } = await supabase
//       .from('appointments')
//       .update(updates)
//       .eq('id', id)
//       .select(`
//         *,
//         patient:patients(*)
//       `)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async deleteAppointment(id) {
//     const { error } = await supabase
//       .from('appointments')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   },

//   // Medicine Inventory
//   async createMedicine(medicine) {
//     const { data, error } = await supabase
//       .from('medicine_inventory')
//       .insert([medicine])
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async getMedicinesByDoctorId(doctorId) {
//     const { data, error } = await supabase
//       .from('medicine_inventory')
//       .select('*')
//       .eq('doctor_id', doctorId)
//       .order('medicine_name', { ascending: true });
    
//     if (error) throw error;
//     return data;
//   },

//   async updateMedicine(id, updates) {
//     const { data, error } = await supabase
//       .from('medicine_inventory')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async deleteMedicine(id) {
//     const { error } = await supabase
//       .from('medicine_inventory')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
//   },

//   async getLowStockMedicines(doctorId) {
//     const { data, error } = await supabase
//       .from('medicine_inventory')
//       .select('*')
//       .eq('doctor_id', doctorId)
//       .filter('quantity_in_stock', 'lte', 'reorder_level')
//       .order('quantity_in_stock', { ascending: true });
    
//     if (error) throw error;
//     return data;
//   },

//   // Prescriptions
//   async createPrescription(prescription, items) {
//     // Create prescription
//     const { data: prescriptionData, error: prescError } = await supabase
//       .from('prescriptions')
//       .insert([prescription])
//       .select()
//       .single();
    
//     if (prescError) throw prescError;

//     // Create prescription items
//     const itemsWithPrescriptionId = items.map(item => ({
//       ...item,
//       prescription_id: prescriptionData.id,
//     }));

//     const { data: itemsData, error: itemsError } = await supabase
//       .from('prescription_items')
//       .insert(itemsWithPrescriptionId)
//       .select();
    
//     if (itemsError) throw itemsError;

//     return { ...prescriptionData, items: itemsData };
//   },

//   async getPrescriptionsByDoctorId(doctorId) {
//     const { data, error } = await supabase
//       .from('prescriptions')
//       .select(`
//         *,
//         patient:patients(*),
//         items:prescription_items(*)
//       `)
//       .eq('doctor_id', doctorId)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   },

//   async getPrescriptionById(id) {
//     const { data, error } = await supabase
//       .from('prescriptions')
//       .select(`
//         *,
//         patient:patients(*),
//         items:prescription_items(*)
//       `)
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   // Invoices
//   async createInvoice(invoice, items) {
//     // Create invoice
//     const { data: invoiceData, error: invoiceError } = await supabase
//       .from('invoices')
//       .insert([invoice])
//       .select()
//       .single();
    
//     if (invoiceError) throw invoiceError;

//     // Create invoice items
//     const itemsWithInvoiceId = items.map(item => ({
//       ...item,
//       invoice_id: invoiceData.id,
//     }));

//     const { data: itemsData, error: itemsError } = await supabase
//       .from('invoice_items')
//       .insert(itemsWithInvoiceId)
//       .select();
    
//     if (itemsError) throw itemsError;

//     // Update inventory quantities
//     for (const item of items) {
//       const { data: medicine } = await supabase
//         .from('medicine_inventory')
//         .select('quantity_in_stock')
//         .eq('id', item.medicine_id)
//         .single();

//       if (medicine) {
//         await supabase
//           .from('medicine_inventory')
//           .update({ 
//             quantity_in_stock: medicine.quantity_in_stock - item.quantity 
//           })
//           .eq('id', item.medicine_id);
//       }
//     }

//     return { ...invoiceData, items: itemsData };
//   },

//   async getInvoicesByDoctorId(doctorId) {
//     const { data, error } = await supabase
//       .from('invoices')
//       .select(`
//         *,
//         patient:patients(*),
//         items:invoice_items(*)
//       `)
//       .eq('doctor_id', doctorId)
//       .order('created_at', { ascending: false });
    
//     if (error) throw error;
//     return data;
//   },

//   async getInvoiceById(id) {
//     const { data, error } = await supabase
//       .from('invoices')
//       .select(`
//         *,
//         patient:patients(*),
//         items:invoice_items(*)
//       `)
//       .eq('id', id)
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   async updateInvoice(id, updates) {
//     const { data, error } = await supabase
//       .from('invoices')
//       .update(updates)
//       .eq('id', id)
//       .select()
//       .single();
    
//     if (error) throw error;
//     return data;
//   },

//   // Dashboard Statistics
//   async getDashboardStats(doctorId) {
//     const [patients, appointments, medicines, invoices] = await Promise.all([
//       supabase.from('patients').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
//       supabase.from('appointments').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
//       supabase.from('medicine_inventory').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
//       supabase.from('invoices').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
//     ]);

//     return {
//       totalPatients: patients.count || 0,
//       totalAppointments: appointments.count || 0,
//       totalMedicines: medicines.count || 0,
//       totalInvoices: invoices.count || 0,
//     };
//   },

//   // Audit Logs
//   async createAuditLog(log) {
//     const { error } = await supabase
//       .from('audit_logs')
//       .insert([log]);
    
//     if (error) console.error('Audit log error:', error);
//   },
// };


// made with rafay40claude

// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Database helper functions
export const db = {

  supabase: supabase,
  
  // Doctors
  async createDoctor(doctor) {
    const { data, error } = await supabase
      .from('doctors')
      .insert([doctor])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getDoctorByEmail(email) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async getDoctorById(id) {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Patients
  async createPatient(patient) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patient])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getPatientsByDoctorId(doctorId) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPatientById(id) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePatient(id, updates) {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePatient(id) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Appointments
  async createAppointment(appointment) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointment])
      .select(`
        *,
        patient:patients(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAppointmentsByDoctorId(doctorId) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*)
      `)
      .eq('doctor_id', doctorId)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateAppointment(id, updates) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select(`
        *,
        patient:patients(*)
      `)
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteAppointment(id) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Medicine Inventory
  async createMedicine(medicine) {
    const { data, error } = await supabase
      .from('medicine_inventory')
      .insert([medicine])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getMedicinesByDoctorId(doctorId) {
    const { data, error } = await supabase
      .from('medicine_inventory')
      .select('*')
      .eq('doctor_id', doctorId)
      .order('medicine_name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async updateMedicine(id, updates) {
    const { data, error } = await supabase
      .from('medicine_inventory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteMedicine(id) {
    const { error } = await supabase
      .from('medicine_inventory')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  async getLowStockMedicines(doctorId) {
    const { data, error } = await supabase
      .from('medicine_inventory')
      .select('*')
      .eq('doctor_id', doctorId)
      .filter('quantity_in_stock', 'lte', 'reorder_level')
      .order('quantity_in_stock', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Prescriptions
  async createPrescription(prescription, items) {
    // Create prescription
    const { data: prescriptionData, error: prescError } = await supabase
      .from('prescriptions')
      .insert([prescription])
      .select()
      .single();
    
    if (prescError) throw prescError;

    // Create prescription items
    const itemsWithPrescriptionId = items.map(item => ({
      ...item,
      prescription_id: prescriptionData.id,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('prescription_items')
      .insert(itemsWithPrescriptionId)
      .select();
    
    if (itemsError) throw itemsError;

    return { ...prescriptionData, items: itemsData };
  },

  async getPrescriptionsByDoctorId(doctorId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(*),
        items:prescription_items(*)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getPrescriptionById(id) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(*),
        items:prescription_items(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updatePrescription(id, updates) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deletePrescription(id) {
    // Delete prescription items first
    const { error: itemsError } = await supabase
      .from('prescription_items')
      .delete()
      .eq('prescription_id', id);
    
    if (itemsError) throw itemsError;

    // Delete prescription
    const { error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Invoices
  async createInvoice(invoice, items) {
    // Create invoice
    const { data: invoiceData, error: invoiceError } = await supabase
      .from('invoices')
      .insert([invoice])
      .select()
      .single();
    
    if (invoiceError) throw invoiceError;

    // Create invoice items
    const itemsWithInvoiceId = items.map(item => ({
      ...item,
      invoice_id: invoiceData.id,
    }));

    const { data: itemsData, error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId)
      .select();
    
    if (itemsError) throw itemsError;

    // Update inventory quantities
    for (const item of items) {
      const { data: medicine } = await supabase
        .from('medicine_inventory')
        .select('quantity_in_stock')
        .eq('id', item.medicine_id)
        .single();

      if (medicine) {
        await supabase
          .from('medicine_inventory')
          .update({ 
            quantity_in_stock: medicine.quantity_in_stock - item.quantity 
          })
          .eq('id', item.medicine_id);
      }
    }

    return { ...invoiceData, items: itemsData };
  },

  async getInvoicesByDoctorId(doctorId) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients(*),
        items:invoice_items(*)
      `)
      .eq('doctor_id', doctorId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getInvoiceById(id) {
    const { data, error } = await supabase
      .from('invoices')
      .select(`
        *,
        patient:patients(*),
        items:invoice_items(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateInvoice(id, updates) {
    const { data, error } = await supabase
      .from('invoices')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteInvoice(id) {
    // Delete invoice items first
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);
    
    if (itemsError) throw itemsError;

    // Delete invoice
    const { error } = await supabase
      .from('invoices')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Dashboard Statistics
  async getDashboardStats(doctorId) {
    const [patients, appointments, medicines, invoices] = await Promise.all([
      supabase.from('patients').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
      supabase.from('appointments').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
      supabase.from('medicine_inventory').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
      supabase.from('invoices').select('id', { count: 'exact' }).eq('doctor_id', doctorId),
    ]);

    return {
      totalPatients: patients.count || 0,
      totalAppointments: appointments.count || 0,
      totalMedicines: medicines.count || 0,
      totalInvoices: invoices.count || 0,
    };
  },

  // Audit Logs
  async createAuditLog(log) {
    const { error } = await supabase
      .from('audit_logs')
      .insert([log]);
    
    if (error) console.error('Audit log error:', error);
  },
};