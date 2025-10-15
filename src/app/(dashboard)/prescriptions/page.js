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

// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Plus, FileText, X, Edit, Trash2, Download, Share2 } from 'lucide-react';

// export default function PrescriptionsPage() {
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingPrescription, setEditingPrescription] = useState(null);
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
//       const url = editingPrescription
//         ? `/api/prescriptions/${editingPrescription.id}`
//         : '/api/prescriptions';
//       const method = editingPrescription ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
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
//         alert(`Prescription ${editingPrescription ? 'updated' : 'created'} successfully!`);
//       } else {
//         const error = await response.json();
//         alert(error.error || `Failed to ${editingPrescription ? 'update' : 'create'} prescription`);
//       }
//     } catch (error) {
//       console.error('Error saving prescription:', error);
//       alert('Failed to save prescription');
//     }
//   };

//   const handleEdit = (prescription) => {
//     setEditingPrescription(prescription);
//     setFormData({
//       patient_id: prescription.patient_id,
//       diagnosis: prescription.diagnosis || '',
//       symptoms: prescription.symptoms || '',
//       notes: prescription.notes || '',
//       follow_up_date: prescription.follow_up_date || '',
//     });
//     setPrescriptionItems(
//       prescription.items.map((item) => ({
//         medicine_id: item.medicine_id,
//         medicine_name: item.medicine_name,
//         dosage: item.dosage,
//         frequency: item.frequency,
//         duration: item.duration,
//         quantity: item.quantity.toString(),
//         instructions: item.instructions || '',
//       }))
//     );
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this prescription? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/prescriptions/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         fetchData();
//         alert('Prescription deleted successfully');
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to delete prescription');
//       }
//     } catch (error) {
//       console.error('Error deleting prescription:', error);
//       alert('Failed to delete prescription');
//     }
//   };

//   const downloadPDF = async (prescription) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/prescriptions/${prescription.id}/pdf`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `prescription-${prescription.id}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       } else {
//         alert('Failed to generate PDF');
//       }
//     } catch (error) {
//       console.error('Error downloading PDF:', error);
//       alert('Failed to download PDF');
//     }
//   };

//   const shareOnWhatsApp = async (prescription) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/prescriptions/${prescription.id}/pdf`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
        
//         const phoneNumber = prescription.patient?.phone_number || '';
//         const message = `Hello ${prescription.patient?.full_name}, here is your prescription from Dr. ${prescription.doctor?.full_name || 'Clinic'}`;
        
//         const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
//         window.open(whatsappUrl, '_blank');
        
//         alert('WhatsApp opened. You can now manually attach the downloaded PDF to your message.');
        
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `prescription-${prescription.id}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         document.body.removeChild(a);
//       }
//     } catch (error) {
//       console.error('Error sharing on WhatsApp:', error);
//       alert('Failed to share on WhatsApp');
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
//     setEditingPrescription(null);
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
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64 text-gray-600">
//           Loading prescriptions...
//         </div>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </DashboardLayout>
//     );
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
//               className="border border-gray-200 rounded-lg p-4 shadow-sm bg-white"
//             >
//               <div className="flex justify-between items-start mb-3">
//                 <div>
//                   <h2 className="font-semibold text-lg">
//                     {prescription.patient?.full_name}
//                   </h2>
//                   <span className="text-sm text-gray-500">
//                     Date: {new Date(prescription.prescription_date).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => downloadPDF(prescription)}
//                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                     title="Download PDF"
//                   >
//                     <Download className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => shareOnWhatsApp(prescription)}
//                     className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
//                     title="Share on WhatsApp"
//                   >
//                     <Share2 className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleEdit(prescription)}
//                     className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
//                     title="Edit"
//                   >
//                     <Edit className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(prescription.id)}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                     title="Delete"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               {prescription.diagnosis && (
//                 <p className="text-gray-700 text-sm mb-2">
//                   <strong>Diagnosis:</strong> {prescription.diagnosis}
//                 </p>
//               )}

//               {prescription.symptoms && (
//                 <p className="text-gray-700 text-sm mb-2">
//                   <strong>Symptoms:</strong> {prescription.symptoms}
//                 </p>
//               )}

//               <div className="mt-3">
//                 <strong className="text-sm">Medicines:</strong>
//                 <ul className="list-disc ml-6 mt-1 text-gray-700 text-sm">
//                   {prescription.items?.map((item, idx) => (
//                     <li key={idx}>
//                       {item.medicine_name} — {item.dosage}, {item.frequency}, {item.duration}
//                       {item.instructions && ` (${item.instructions})`}
//                     </li>
//                   ))}
//                 </ul>
//               </div>

//               {prescription.follow_up_date && (
//                 <p className="text-gray-600 text-sm mt-3">
//                   <strong>Follow-up:</strong> {new Date(prescription.follow_up_date).toLocaleDateString()}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl overflow-y-auto max-h-[90vh]">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold">
//                 {editingPrescription ? 'Edit Prescription' : 'New Prescription'}
//               </h2>
//               <button
//                 onClick={() => {
//                   setShowModal(false);
//                   resetForm();
//                 }}
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
//                   disabled={editingPrescription !== null}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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
//                   {!editingPrescription && (
//                     <button
//                       type="button"
//                       onClick={addItem}
//                       className="text-sm text-blue-600 hover:text-blue-700"
//                     >
//                       + Add Medicine
//                     </button>
//                   )}
//                 </div>

//                 {prescriptionItems.map((item, index) => (
//                   <div
//                     key={index}
//                     className="border border-gray-200 rounded-lg p-3 mb-3 space-y-2 bg-gray-50"
//                   >
//                     <div>
//                       <label className="block text-sm font-medium mb-1">Medicine *</label>
//                       <select
//                         value={item.medicine_id}
//                         onChange={(e) =>
//                           updateItem(index, 'medicine_id', e.target.value)
//                         }
//                         required
//                         disabled={editingPrescription !== null}
//                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
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

//                     {prescriptionItems.length > 1 && !editingPrescription && (
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
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   {editingPrescription ? 'Update Prescription' : 'Create Prescription'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }




// updated ui for this page 

// src/app/prescriptions/page.js
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Plus, FileText, X, Edit, Trash2, Download, Share2, Search, Filter, Calendar, User, Pill, Eye, Clock, AlertCircle, CheckCircle, Printer, Send } from 'lucide-react';
import { toast } from 'react-toastify';

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [editingPrescription, setEditingPrescription] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
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
        toast.success(`Prescription ${editingPrescription ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await response.json();
        toast.error(error.error || `Failed to ${editingPrescription ? 'update' : 'create'} prescription`);
      }
    } catch (error) {
      console.error('Error saving prescription:', error);
      toast.error('Failed to save prescription');
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
        toast.success('Prescription deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete prescription');
      }
    } catch (error) {
      console.error('Error deleting prescription:', error);
      toast.dismiss('Failed to delete prescription');
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
        toast.success("pdf has downloaded")
      } else {
        toast.error('Failed to generate PDF');
      }
    } catch (error) {
      console.error('Error downloading PDF:', error);
    toast.error('Failed to download PDF');
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

  const viewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const filteredPrescriptions = prescriptions
    .filter(p => {
      const matchesSearch = p.patient?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterStatus === 'recent') {
        const date = new Date(p.prescription_date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return matchesSearch && date >= weekAgo;
      }
      
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.prescription_date) - new Date(a.prescription_date);
      if (sortBy === 'oldest') return new Date(a.prescription_date) - new Date(b.prescription_date);
      if (sortBy === 'patient') return (a.patient?.full_name || '').localeCompare(b.patient?.full_name || '');
      return 0;
    });

  const stats = {
    total: prescriptions.length,
    thisWeek: prescriptions.filter(p => {
      const date = new Date(p.prescription_date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return date >= weekAgo;
    }).length,
    followUps: prescriptions.filter(p => {
      if (!p.follow_up_date) return false;
      const followUp = new Date(p.follow_up_date);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return followUp >= today && followUp <= weekFromNow;
    }).length
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Prescriptions</h1>
              <p className="text-purple-100">Create and manage patient prescriptions</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className=" cursor-pointer inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-xl hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Prescription
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-4 bg-purple-100 rounded-xl">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.thisWeek}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming Follow-ups</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.followUps}</p>
              </div>
              <div className="p-4 bg-orange-100 rounded-xl">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name or diagnosis..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="patient">Patient Name</option>
            </select>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'all' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({prescriptions.length})
            </button>
            <button
              onClick={() => setFilterStatus('recent')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === 'recent' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              This Week ({stats.thisWeek})
            </button>
          </div>
        </div>

        {/* Prescriptions List */}
        <div className="grid gap-6">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 border-2 border-gray-200 transition-all transform hover:-translate-y-1"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl shadow-md">
                    <User className="w-8 h-8 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {prescription.patient?.full_name}
                    </h2>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(prescription.prescription_date).toLocaleDateString()}
                      </span>
                      {prescription.follow_up_date && (
                        <span className="inline-flex items-center px-3 py-1 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                          <Clock className="w-4 h-4 mr-1" />
                          Follow-up: {new Date(prescription.follow_up_date).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => viewDetails(prescription)}
                    className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => downloadPDF(prescription)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => shareOnWhatsApp(prescription)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEdit(prescription)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(prescription.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {prescription.diagnosis && (
                <div className="mb-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Diagnosis:</p>
                  <p className="text-gray-800">{prescription.diagnosis}</p>
                </div>
              )}

              {prescription.symptoms && (
                <div className="mb-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Symptoms:</p>
                  <p className="text-gray-800">{prescription.symptoms}</p>
                </div>
              )}

              <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200">
                <div className="flex items-center mb-3">
                  <Pill className="w-5 h-5 text-purple-600 mr-2" />
                  <strong className="text-purple-900 font-semibold">Prescribed Medicines</strong>
                </div>
                <div className="space-y-2">
                  {prescription.items?.map((item, idx) => (
                    <div key={idx} className="bg-white p-3 rounded-lg shadow-sm border border-purple-100">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900">{item.medicine_name}</p>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2 text-sm">
                            <div>
                              <span className="text-gray-600">Dosage:</span>
                              <span className="ml-1 font-semibold text-gray-900">{item.dosage}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Frequency:</span>
                              <span className="ml-1 font-semibold text-gray-900">{item.frequency}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Duration:</span>
                              <span className="ml-1 font-semibold text-gray-900">{item.duration}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Qty:</span>
                              <span className="ml-1 font-semibold text-gray-900">{item.quantity}</span>
                            </div>
                          </div>
                          {item.instructions && (
                            <p className="mt-2 text-sm text-indigo-700 italic">
                              <AlertCircle className="w-4 h-4 inline mr-1" />
                              {item.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-1">Additional Notes:</p>
                  <p className="text-gray-800">{prescription.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <FileText className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-medium">No prescriptions found</p>
            <p className="text-gray-400 mt-2">Create your first prescription to get started</p>
          </div>
        )}
      </div>

      {/* Add/Edit Prescription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                {editingPrescription ? 'Edit Prescription' : 'New Prescription'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Patient Selection */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Patient Information
                </h3>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient *</label>
                  <select
                    value={formData.patient_id}
                    onChange={(e) =>
                      setFormData({ ...formData, patient_id: e.target.value })
                    }
                    required
                    disabled={editingPrescription !== null}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 transition-all"
                  >
                    <option value="">Choose a patient</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.full_name} {patient.phone_number && `- ${patient.phone_number}`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Diagnosis and Symptoms */}
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Clinical Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis</label>
                    <input
                      type="text"
                      value={formData.diagnosis}
                      onChange={(e) =>
                        setFormData({ ...formData, diagnosis: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      placeholder="Enter diagnosis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Follow-up Date</label>
                    <input
                      type="date"
                      value={formData.follow_up_date}
                      onChange={(e) =>
                        setFormData({ ...formData, follow_up_date: e.target.value })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Symptoms</label>
                    <textarea
                      value={formData.symptoms}
                      onChange={(e) =>
                        setFormData({ ...formData, symptoms: e.target.value })
                      }
                      rows="3"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                      placeholder="Describe patient symptoms..."
                    />
                  </div>
                </div>
              </div>

              {/* Medicines */}
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-purple-900 flex items-center">
                    <Pill className="w-5 h-5 mr-2" />
                    Prescribed Medicines
                  </h3>
                  {!editingPrescription && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="inline-flex items-center px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-md transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Medicine
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {prescriptionItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white border-2 border-purple-200 rounded-xl p-5 space-y-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-purple-600 text-white text-sm font-bold rounded-full">
                          Medicine #{index + 1}
                        </span>
                        {prescriptionItems.length > 1 && !editingPrescription && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors font-semibold text-sm"
                          >
                            <Trash2 className="w-4 h-4 inline mr-1" />
                            Remove
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Medicine *</label>
                        <select
                          value={item.medicine_id}
                          onChange={(e) =>
                            updateItem(index, 'medicine_id', e.target.value)
                          }
                          required
                          disabled={editingPrescription !== null}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 transition-all"
                        >
                          <option value="">Choose a medicine</option>
                          {medicines.map((med) => (
                            <option key={med.id} value={med.id}>
                              {med.medicine_name} ({med.strength}) - Stock: {med.quantity_in_stock}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage *</label>
                          <input
                            type="text"
                            placeholder="e.g., 1 tablet, 5ml"
                            value={item.dosage}
                            onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Frequency *</label>
                          <input
                            type="text"
                            placeholder="e.g., 3 times daily, Twice a day"
                            value={item.frequency}
                            onChange={(e) => updateItem(index, 'frequency', e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Duration *</label>
                          <input
                            type="text"
                            placeholder="e.g., 7 days, 2 weeks"
                            value={item.duration}
                            onChange={(e) => updateItem(index, 'duration', e.target.value)}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity *</label>
                          <input
                            type="number"
                            placeholder="e.g., 21, 10"
                            value={item.quantity}
                            onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                            required
                            min="1"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">Instructions</label>
                        <input
                          type="text"
                          placeholder="e.g., Take after meals, With water"
                          value={item.instructions}
                          onChange={(e) =>
                            updateItem(index, 'instructions', e.target.value)
                          }
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Additional Notes
                </h3>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all resize-none"
                  placeholder="Any additional instructions or notes for the patient..."
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {editingPrescription ? 'Update Prescription' : 'Create Prescription'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedPrescription && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">Prescription Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              {/* Patient Info */}
              <div className="flex items-start gap-6 mb-8 pb-6 border-b-2 border-gray-200">
                <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl shadow-lg">
                  <User className="w-12 h-12 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedPrescription.patient?.full_name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-1.5 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      {new Date(selectedPrescription.prescription_date).toLocaleDateString()}
                    </span>
                    {selectedPrescription.follow_up_date && (
                      <span className="px-4 py-1.5 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                        <Clock className="w-4 h-4 inline mr-1" />
                        Follow-up: {new Date(selectedPrescription.follow_up_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {selectedPrescription.diagnosis && (
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                    <p className="text-sm font-semibold text-blue-700 mb-2">Diagnosis</p>
                    <p className="text-lg font-bold text-gray-900">{selectedPrescription.diagnosis}</p>
                  </div>
                )}

                {selectedPrescription.symptoms && (
                  <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border-2 border-amber-200">
                    <p className="text-sm font-semibold text-amber-700 mb-2">Symptoms</p>
                    <p className="text-lg font-bold text-gray-900">{selectedPrescription.symptoms}</p>
                  </div>
                )}
              </div>

              {/* Medicines */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <Pill className="w-6 h-6 text-purple-600 mr-2" />
                  <h3 className="text-2xl font-bold text-gray-900">Prescribed Medicines</h3>
                </div>
                <div className="space-y-4">
                  {selectedPrescription.items?.map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-xl border-2 border-purple-200 shadow-sm">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-xl font-bold text-purple-900">{item.medicine_name}</h4>
                        <span className="px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-full">
                          #{idx + 1}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Dosage</p>
                          <p className="font-bold text-gray-900">{item.dosage}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Frequency</p>
                          <p className="font-bold text-gray-900">{item.frequency}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Duration</p>
                          <p className="font-bold text-gray-900">{item.duration}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Quantity</p>
                          <p className="font-bold text-gray-900">{item.quantity}</p>
                        </div>
                      </div>
                      {item.instructions && (
                        <div className="mt-3 p-3 bg-indigo-100 rounded-lg border border-indigo-300">
                          <p className="text-sm font-semibold text-indigo-900">
                            <AlertCircle className="w-4 h-4 inline mr-1" />
                            Instructions: {item.instructions}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Notes */}
              {selectedPrescription.notes && (
                <div className="bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Additional Notes</p>
                  <p className="text-gray-900">{selectedPrescription.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedPrescription);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => downloadPDF(selectedPrescription)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => shareOnWhatsApp(selectedPrescription)}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  WhatsApp
                </button>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}