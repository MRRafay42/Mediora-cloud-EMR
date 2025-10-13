// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Plus, FileText, X } from 'lucide-react';

// export default function PrescriptionsPage() {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     patient_id: '',
//     diagnosis: '',
//     symptoms: '',
//     notes: '',
//     follow_up_date: '',
//   });
//   const [prescriptionItems, setPrescriptionItems] = useState([
//     {
//       medicine_id: '',
//       medicine_name: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       quantity: '',
//       instructions: '',
//     },
//   ]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };

//       const [presRes, patRes, medRes] = await Promise.all([
//         fetch('/api/prescriptions', { headers }),
//         fetch('/api/patients', { headers }),
//         fetch('/api/inventory', { headers }),
//       ]);

//       const [presData, patData, medData] = await Promise.all([
//         presRes.json(),
//         patRes.json(),
//         medRes.json(),
//       ]);

//       setPrescriptions(presData.prescriptions || []);
//       setPatients(patData.patients || []);
//       setMedicines(medData.medicines || []);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch('/api/prescriptions', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           items: prescriptionItems,
//         }),
//       });

//       if (response.ok) {
//         fetchData();
//         setShowModal(false);
//         resetForm();
//       }
//     } catch (error) {
//       console.error('Error creating prescription:', error);
//     }
//   };

//   const addItem = () => {
//     setPrescriptionItems([
//       ...prescriptionItems,
//       {
//         medicine_id: '',
//         medicine_name: '',
//         dosage: '',
//         frequency: '',
//         duration: '',
//         quantity: '',
//         instructions: '',
//       },
//     ]);
//   };

//   const removeItem = (index) => {
//     setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
//   };

//   const updateItem = (index, field, value) => {
//     const updated = [...prescriptionItems];
//     updated[index][field] = value;

//     if (field === 'medicine_id') {
//       const medicine = medicines.find((m) => m.id === value);
//       if (medicine) {
//         updated[index].medicine_name = medicine.medicine_name;
//       }
//     }

//     setPrescriptionItems(updated);
//   };

//   const resetForm = () => {
//     setFormData({
//       patient_id: '',
//       diagnosis: '',
//       symptoms: '',
//       notes: '',
//       follow_up_date: '',
//     });
//     setPrescriptionItems([
//       {
//         medicine_id: '',
//         medicine_name: '',
//         dosage: '',
//         frequency: '',
//         duration: '',
//         quantity: '',
//         instructions: '',
//       },
//     ]);
//   };

//   if (loading) {
//     return <div className="p-8 text-center">Loading...</div>;
//   }

//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         <div className="flex justify-between items-center mb-6">
//           <div>
//             <h1 className="text-2xl font-semibold">Prescriptions</h1>
//             <p className="text-gray-600">Create and manage prescriptions</p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="mr-2 w-4 h-4" />
//             New Prescription
//           </button>
//         </div>

//         <div className="grid gap-4">
//           {prescriptions.map((prescription) => (
//             <div
//               key={prescription.id}
//               className="border border-gray-200 rounded-lg p-4 shadow-sm"
//             >
//               <div className="flex justify-between items-center">
//                 <h2 className="font-semibold">
//                   {prescription.patient?.full_name}
//                 </h2>
//                 <span className="text-sm text-gray-500">
//                   Date: {new Date(prescription.prescription_date).toLocaleDateString()}
//                 </span>
//               </div>

//               {prescription.diagnosis && (
//                 <p className="mt-2 text-gray-700">
//                   <strong>Diagnosis:</strong> {prescription.diagnosis}
//                 </p>
//               )}

//               <div className="mt-3">
//                 <strong>Medicines:</strong>
//                 <ul className="list-disc ml-6 mt-1 text-gray-700">
//                   {prescription.items?.map((item, idx) => (
//                     <li key={idx}>
//                       {item.medicine_name} — {item.dosage}, {item.frequency}, {item.duration}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">New Prescription</h2>
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="text-gray-400 hover:text-gray-600"
//               >
//                 <X />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Patient *</label>
//                 <select
//                   value={formData.patient_id}
//                   onChange={(e) =>
//                     setFormData({ ...formData, patient_id: e.target.value })
//                   }
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Patient</option>
//                   {patients.map((patient) => (
//                     <option key={patient.id} value={patient.id}>
//                       {patient.full_name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Diagnosis</label>
//                   <input
//                     type="text"
//                     value={formData.diagnosis}
//                     onChange={(e) =>
//                       setFormData({ ...formData, diagnosis: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium mb-1">
//                     Follow-up Date
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.follow_up_date}
//                     onChange={(e) =>
//                       setFormData({ ...formData, follow_up_date: e.target.value })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Symptoms</label>
//                 <textarea
//                   value={formData.symptoms}
//                   onChange={(e) =>
//                     setFormData({ ...formData, symptoms: e.target.value })
//                   }
//                   rows="2"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <div className="flex justify-between items-center mb-2">
//                   <label className="block text-sm font-medium">Medicines</label>
//                   <button
//                     type="button"
//                     onClick={addItem}
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                   >
//                     + Add Medicine
//                   </button>
//                 </div>

//                 {prescriptionItems.map((item, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 rounded-lg p-3 mb-3 space-y-2"
//                   >
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Medicine *</label>
//                       <select
//                         value={item.medicine_id}
//                         onChange={(e) =>
//                           updateItem(index, 'medicine_id', e.target.value)
//                         }
//                         required
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       >
//                         <option value="">Select Medicine</option>
//                         {medicines.map((med) => (
//                           <option key={med.id} value={med.id}>
//                             {med.medicine_name} ({med.strength}) - Stock:{' '}
//                             {med.quantity_in_stock}
//                           </option>
//                         ))}
//                       </select>
//                     </div>

//                     <input
//                       type="text"
//                       placeholder="Dosage (e.g., 1 tablet)"
//                       value={item.dosage}
//                       onChange={(e) => updateItem(index, 'dosage', e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Frequency (e.g., 3 times daily)"
//                       value={item.frequency}
//                       onChange={(e) => updateItem(index, 'frequency', e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Duration (e.g., 7 days)"
//                       value={item.duration}
//                       onChange={(e) => updateItem(index, 'duration', e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                       type="number"
//                       placeholder="Quantity"
//                       value={item.quantity}
//                       onChange={(e) => updateItem(index, 'quantity', e.target.value)}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Instructions (e.g., after meals)"
//                       value={item.instructions}
//                       onChange={(e) =>
//                         updateItem(index, 'instructions', e.target.value)
//                       }
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />

//                     {prescriptionItems.length > 1 && (
//                       <button
//                         type="button"
//                         onClick={() => removeItem(index)}
//                         className="text-sm text-red-600 hover:text-red-700"
//                       >
//                         Remove Medicine
//                       </button>
//                     )}
//                   </div>
//                 ))}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Notes</label>
//                 <textarea
//                   value={formData.notes}
//                   onChange={(e) =>
//                     setFormData({ ...formData, notes: e.target.value })
//                   }
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex justify-end space-x-3">
//                 <button
//                   type="button"
//                   onClick={() => setShowModal(false)}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   Create Prescription
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }



// made with rafay40

// FILE 1: src/app/prescriptions/page.js
// ============================================================

'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Plus, FileText, X, Edit, Trash2, Download, Share2 } from 'lucide-react';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patient_id: '',
    diagnosis: '',
    symptoms: '',
    notes: '',
    follow_up_date: '',
  });
  const [prescriptionItems, setPrescriptionItems] = useState([
    {
      medicine_id: '',
      medicine_name: '',
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      instructions: '',
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [presRes, patRes, medRes] = await Promise.all([
        fetch('/api/prescriptions', { headers }),
        fetch('/api/patients', { headers }),
        fetch('/api/inventory', { headers }),
      ]);

      const [presData, patData, medData] = await Promise.all([
        presRes.json(),
        patRes.json(),
        medRes.json(),
      ]);

      setPrescriptions(presData.prescriptions || []);
      setPatients(patData.patients || []);
      setMedicines(medData.medicines || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPrescription
        ? `/api/prescriptions/${editingPrescription.id}`
        : '/api/prescriptions';
      const method = editingPrescription ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: prescriptionItems,
        }),
      });

      if (response.ok) {
        fetchData();
        setShowModal(false);
        resetForm();
        alert(`Prescription ${editingPrescription ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await response.json();
        alert(error.error || `Failed to ${editingPrescription ? 'update' : 'create'} prescription`);
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Failed to save prescription');
    }
  };

  const handleEdit = (prescription) => {
    setEditingPrescription(prescription);
    setFormData({
      patient_id: prescription.patient_id,
      diagnosis: prescription.diagnosis || '',
      symptoms: prescription.symptoms || '',
      notes: prescription.notes || '',
      follow_up_date: prescription.follow_up_date || '',
    });
    setPrescriptionItems(
      prescription.items.map((item) => ({
        medicine_id: item.medicine_id,
        medicine_name: item.medicine_name,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        quantity: item.quantity.toString(),
        instructions: item.instructions || '',
      }))
    );
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/prescriptions/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchData();
        alert('Prescription deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete prescription');
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Failed to delete prescription');
    }
  };

  const downloadPDF = async (prescription) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/prescriptions/${prescription.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescription-${prescription.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to download PDF');
    }
  };

  const shareOnWhatsApp = async (prescription) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/prescriptions/${prescription.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const phoneNumber = prescription.patient?.phone_number || '';
        const message = `Hello ${prescription.patient?.full_name}, here is your prescription from Dr. ${prescription.doctor?.full_name || 'Clinic'}`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        alert('WhatsApp opened. You can now manually attach the downloaded PDF to your message.');
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `prescription-${prescription.id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error sharing on WhatsApp:', error);
      alert('Failed to share on WhatsApp');
    }
  };

  const addItem = () => {
    setPrescriptionItems([
      ...prescriptionItems,
      {
        medicine_id: '',
        medicine_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        instructions: '',
      },
    ]);
  };

  const removeItem = (index) => {
    setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...prescriptionItems];
    updated[index][field] = value;

    if (field === 'medicine_id') {
      const medicine = medicines.find((m) => m.id === value);
      if (medicine) {
        updated[index].medicine_name = medicine.medicine_name;
      }
    }

    setPrescriptionItems(updated);
  };

  const resetForm = () => {
    setEditingPrescription(null);
    setFormData({
      patient_id: '',
      diagnosis: '',
      symptoms: '',
      notes: '',
      follow_up_date: '',
    });
    setPrescriptionItems([
      {
        medicine_id: '',
        medicine_name: '',
        dosage: '',
        frequency: '',
        duration: '',
        quantity: '',
        instructions: '',
      },
    ]);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-600">
          Loading prescriptions...
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Prescriptions</h1>
            <p className="text-gray-600">Create and manage prescriptions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="mr-2 w-4 h-4" />
            New Prescription
          </button>
        </div>

        <div className="grid gap-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-lg">
                    {prescription.patient?.full_name}
                  </h2>
                  <span className="text-sm text-gray-500">
                    Date: {new Date(prescription.prescription_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPDF(prescription)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => shareOnWhatsApp(prescription)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(prescription)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {prescription.diagnosis && (
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Diagnosis:</strong> {prescription.diagnosis}
                </p>
              )}

              {prescription.symptoms && (
                <p className="text-gray-700 text-sm mb-2">
                  <strong>Symptoms:</strong> {prescription.symptoms}
                </p>
              )}

              <div className="mt-3">
                <strong className="text-sm">Medicines:</strong>
                <ul className="list-disc ml-6 mt-1 text-gray-700 text-sm">
                  {prescription.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.medicine_name} — {item.dosage}, {item.frequency}, {item.duration}
                      {item.instructions && ` (${item.instructions})`}
                    </li>
                  ))}
                </ul>
              </div>

              {prescription.follow_up_date && (
                <p className="text-gray-600 text-sm mt-3">
                  <strong>Follow-up:</strong> {new Date(prescription.follow_up_date).toLocaleDateString()}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingPrescription ? 'Edit Prescription' : 'New Prescription'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient *</label>
                <select
                  value={formData.patient_id}
                  onChange={(e) =>
                    setFormData({ ...formData, patient_id: e.target.value })
                  }
                  required
                  disabled={editingPrescription !== null}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                >
                  <option value="">Select Patient</option>
                  {patients.map((patient) => (
                    <option key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Diagnosis</label>
                  <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnosis: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Follow-up Date
                  </label>
                  <input
                    type="date"
                    value={formData.follow_up_date}
                    onChange={(e) =>
                      setFormData({ ...formData, follow_up_date: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Symptoms</label>
                <textarea
                  value={formData.symptoms}
                  onChange={(e) =>
                    setFormData({ ...formData, symptoms: e.target.value })
                  }
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium">Medicines</label>
                  {!editingPrescription && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      + Add Medicine
                    </button>
                  )}
                </div>

                {prescriptionItems.map((item, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-3 mb-3 space-y-2 bg-gray-50"
                  >
                    <div>
                      <label className="block text-sm font-medium mb-1">Medicine *</label>
                      <select
                        value={item.medicine_id}
                        onChange={(e) =>
                          updateItem(index, 'medicine_id', e.target.value)
                        }
                        required
                        disabled={editingPrescription !== null}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                      >
                        <option value="">Select Medicine</option>
                        {medicines.map((med) => (
                          <option key={med.id} value={med.id}>
                            {med.medicine_name} ({med.strength}) - Stock:{' '}
                            {med.quantity_in_stock}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Dosage (e.g., 1 tablet)"
                      value={item.dosage}
                      onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Frequency (e.g., 3 times daily)"
                      value={item.frequency}
                      onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 days)"
                      value={item.duration}
                      onChange={(e) => updateItem(index, 'duration', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Instructions (e.g., after meals)"
                      value={item.instructions}
                      onChange={(e) =>
                        updateItem(index, 'instructions', e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />

                    {prescriptionItems.length > 1 && !editingPrescription && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Remove Medicine
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingPrescription ? 'Update Prescription' : 'Create Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}