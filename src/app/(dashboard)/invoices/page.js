// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Plus, Receipt, Download, X } from 'lucide-react';

// export default function InvoicesPage() {
//   const [invoices, setInvoices] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [formData, setFormData] = useState({
//     patient_id: '',
//     payment_method: 'cash',
//     tax_amount: '0',
//     discount_amount: '0',
//     notes: '',
//   });
//   const [invoiceItems, setInvoiceItems] = useState([
//     {
//       medicine_id: '',
//       item_name: '',
//       quantity: '',
//       unit_price: '',
//       total_price: 0,
//     },
//   ]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };

//       const [invRes, patRes, medRes] = await Promise.all([
//         fetch('/api/invoices', { headers }),
//         fetch('/api/patients', { headers }),
//         fetch('/api/inventory', { headers }),
//       ]);

//       const [invData, patData, medData] = await Promise.all([
//         invRes.json(),
//         patRes.json(),
//         medRes.json(),
//       ]);

//       setInvoices(invData.invoices || []);
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
//       const response = await fetch('/api/invoices', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           items: invoiceItems,
//         }),
//       });

//       if (response.ok) {
//         fetchData();
//         setShowModal(false);
//         resetForm();
//         alert('Invoice created successfully! Inventory updated.');
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to create invoice');
//       }
//     } catch (error) {
//       console.error('Error creating invoice:', error);
//       alert('Failed to create invoice');
//     }
//   };

//   const addItem = () => {
//     setInvoiceItems([
//       ...invoiceItems,
//       {
//         medicine_id: '',
//         item_name: '',
//         quantity: '',
//         unit_price: '',
//         total_price: 0,
//       },
//     ]);
//   };

//   const removeItem = (index) => {
//     setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
//   };

//   const updateItem = (index, field, value) => {
//     const updated = [...invoiceItems];
//     updated[index][field] = value;

//     if (field === 'medicine_id') {
//       const medicine = medicines.find((m) => m.id === value);
//       if (medicine) {
//         updated[index].item_name = medicine.medicine_name;
//         updated[index].unit_price = medicine.unit_price;
//       }
//     }

//     if (field === 'quantity' || field === 'unit_price') {
//       const qty = parseFloat(updated[index].quantity) || 0;
//       const price = parseFloat(updated[index].unit_price) || 0;
//       updated[index].total_price = qty * price;
//     }

//     setInvoiceItems(updated);
//   };

//   const calculateSubtotal = () => {
//     return invoiceItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
//   };

//   const calculateTotal = () => {
//     const subtotal = calculateSubtotal();
//     const tax = parseFloat(formData.tax_amount) || 0;
//     const discount = parseFloat(formData.discount_amount) || 0;
//     return subtotal + tax - discount;
//   };

//   const resetForm = () => {
//     setFormData({
//       patient_id: '',
//       payment_method: 'cash',
//       tax_amount: '0',
//       discount_amount: '0',
//       notes: '',
//     });
//     setInvoiceItems([
//       {
//         medicine_id: '',
//         item_name: '',
//         quantity: '',
//         unit_price: '',
//         total_price: 0,
//       },
//     ]);
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       paid: 'bg-green-100 text-green-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       partially_paid: 'bg-orange-100 text-orange-800',
//       cancelled: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64 text-gray-600">
//           Loading invoices...
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="p-6">
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">Invoices</h1>
//             <p className="text-gray-500">Generate and manage patient invoices</p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             New Invoice
//           </button>
//         </div>

//         <div className="grid gap-4">
//           {invoices.map((invoice) => (
//             <div
//               key={invoice.id}
//               className="border p-4 rounded-lg bg-white shadow-sm"
//             >
//               <div className="flex justify-between items-center mb-2">
//                 <div>
//                   <h2 className="font-semibold">{invoice.invoice_number}</h2>
//                   <span
//                     className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(
//                       invoice.payment_status
//                     )}`}
//                   >
//                     {invoice.payment_status}
//                   </span>
//                 </div>
//                 <div className="text-right text-gray-600 text-sm">
//                   <p>Patient: {invoice.patient?.full_name}</p>
//                   <p>
//                     Date:{' '}
//                     {new Date(invoice.invoice_date).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-between mt-2">
//                 <div>
//                   <p className="text-gray-700 font-medium">
//                     PKR {invoice.total_amount.toFixed(2)}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {invoice.payment_method}
//                   </p>
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <p className="font-medium">Items:</p>
//                 <ul className="list-disc list-inside text-gray-700">
//                   {invoice.items?.map((item, idx) => (
//                     <li key={idx}>
//                       {item.item_name} (x{item.quantity}) — PKR{' '}
//                       {item.total_price.toFixed(2)}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ))}
//         </div>

//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">New Invoice</h2>
//                 <button
//                   onClick={() => setShowModal(false)}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block mb-1 font-medium">Patient *</label>
//                   <select
//                     value={formData.patient_id}
//                     onChange={(e) =>
//                       setFormData({ ...formData, patient_id: e.target.value })
//                     }
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Patient</option>
//                     {patients.map((patient) => (
//                       <option key={patient.id} value={patient.id}>
//                         {patient.full_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium">Payment Method</label>
//                   <select
//                     value={formData.payment_method}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         payment_method: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="card">Card</option>
//                     <option value="bank">Bank Transfer</option>
//                     <option value="insurance">Insurance</option>
//                   </select>
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="font-medium">Items</label>
//                     <button
//                       type="button"
//                       onClick={addItem}
//                       className="text-blue-600 hover:text-blue-800 text-sm"
//                     >
//                       + Add Item
//                     </button>
//                   </div>

//                   {invoiceItems.map((item, index) => (
//                     <div
//                       key={index}
//                       className="border p-3 rounded-lg mb-3 bg-gray-50"
//                     >
//                       <div className="grid grid-cols-2 gap-3 mb-2">
//                         <div>
//                           <label className="block text-sm mb-1">
//                             Medicine *
//                           </label>
//                           <select
//                             value={item.medicine_id}
//                             onChange={(e) =>
//                               updateItem(index, 'medicine_id', e.target.value)
//                             }
//                             required
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                           >
//                             <option value="">Select Medicine</option>
//                             {medicines.map((med) => (
//                               <option key={med.id} value={med.id}>
//                                 {med.medicine_name} - PKR {med.unit_price} (
//                                 Stock: {med.quantity_in_stock})
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-sm mb-1">
//                             Quantity *
//                           </label>
//                           <input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               updateItem(index, 'quantity', e.target.value)
//                             }
//                             required
//                             min="1"
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                           />
//                         </div>
//                       </div>

//                       <p className="text-sm text-gray-600">
//                         Total: PKR {item.total_price.toFixed(2)}
//                       </p>

//                       {invoiceItems.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeItem(index)}
//                           className="mt-2 text-red-600 hover:text-red-800 text-sm"
//                         >
//                           Remove Item
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm mb-1">Tax Amount</label>
//                     <input
//                       type="number"
//                       value={formData.tax_amount}
//                       onChange={(e) =>
//                         setFormData({ ...formData, tax_amount: e.target.value })
//                       }
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm mb-1">Discount</label>
//                     <input
//                       type="number"
//                       value={formData.discount_amount}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           discount_amount: e.target.value,
//                         })
//                       }
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <p className="text-sm font-medium">
//                     Subtotal: PKR {calculateSubtotal().toFixed(2)}
//                   </p>
//                   <p className="text-lg font-semibold">
//                     Total: PKR {calculateTotal().toFixed(2)}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium">Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) =>
//                       setFormData({ ...formData, notes: e.target.value })
//                     }
//                     rows="2"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => setShowModal(false)}
//                     className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     Create Invoice
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }


// made with rafay40

// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Plus, Receipt, Download, X, Edit, Trash2, Share2 } from 'lucide-react';

// export default function InvoicesPage() {
//   const [invoices, setInvoices] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingInvoice, setEditingInvoice] = useState(null);
//   const [formData, setFormData] = useState({
//     patient_id: '',
//     payment_method: 'cash',
//     tax_amount: '0',
//     discount_amount: '0',
//     notes: '',
//   });
//   const [invoiceItems, setInvoiceItems] = useState([
//     {
//       medicine_id: '',
//       item_name: '',
//       quantity: '',
//       unit_price: '',
//       total_price: 0,
//     },
//   ]);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const headers = { Authorization: `Bearer ${token}` };

//       const [invRes, patRes, medRes] = await Promise.all([
//         fetch('/api/invoices', { headers }),
//         fetch('/api/patients', { headers }),
//         fetch('/api/inventory', { headers }),
//       ]);

//       const [invData, patData, medData] = await Promise.all([
//         invRes.json(),
//         patRes.json(),
//         medRes.json(),
//       ]);

//       setInvoices(invData.invoices || []);
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
//       const url = editingInvoice 
//         ? `/api/invoices/${editingInvoice.id}`
//         : '/api/invoices';
//       const method = editingInvoice ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           ...formData,
//           items: invoiceItems,
//         }),
//       });

//       if (response.ok) {
//         fetchData();
//         setShowModal(false);
//         resetForm();
//         alert(`Invoice ${editingInvoice ? 'updated' : 'created'} successfully!`);
//       } else {
//         const error = await response.json();
//         alert(error.error || `Failed to ${editingInvoice ? 'update' : 'create'} invoice`);
//       }
//     } catch (error) {
//       console.error('Error saving invoice:', error);
//       alert('Failed to save invoice');
//     }
//   };

//   const handleEdit = (invoice) => {
//     setEditingInvoice(invoice);
//     setFormData({
//       patient_id: invoice.patient_id,
//       payment_method: invoice.payment_method,
//       tax_amount: invoice.tax_amount.toString(),
//       discount_amount: invoice.discount_amount.toString(),
//       notes: invoice.notes || '',
//     });
//     setInvoiceItems(
//       invoice.items.map((item) => ({
//         medicine_id: item.medicine_id,
//         item_name: item.item_name,
//         quantity: item.quantity.toString(),
//         unit_price: item.unit_price.toString(),
//         total_price: item.total_price,
//       }))
//     );
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/invoices/${id}`, {
//         method: 'DELETE',
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         fetchData();
//         alert('Invoice deleted successfully');
//       } else {
//         const error = await response.json();
//         alert(error.error || 'Failed to delete invoice');
//       }
//     } catch (error) {
//       console.error('Error deleting invoice:', error);
//       alert('Failed to delete invoice');
//     }
//   };

//   const downloadPDF = async (invoice) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `invoice-${invoice.invoice_number}.pdf`;
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

//   const shareOnWhatsApp = async (invoice) => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
        
//         // For WhatsApp sharing, we need the patient's phone number
//         const phoneNumber = invoice.patient?.phone_number || '';
//         const message = `Hello ${invoice.patient?.full_name}, here is your invoice ${invoice.invoice_number} for PKR ${invoice.total_amount.toFixed(2)}`;
        
//         // Open WhatsApp with pre-filled message
//         const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
//         window.open(whatsappUrl, '_blank');
        
//         // Note: The PDF will need to be sent manually in WhatsApp
//         alert('WhatsApp opened. You can now manually attach the downloaded PDF to your message.');
        
//         // Trigger download so user has the file to attach
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `invoice-${invoice.invoice_number}.pdf`;
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
//     setInvoiceItems([
//       ...invoiceItems,
//       {
//         medicine_id: '',
//         item_name: '',
//         quantity: '',
//         unit_price: '',
//         total_price: 0,
//       },
//     ]);
//   };

//   const removeItem = (index) => {
//     setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
//   };

//   const updateItem = (index, field, value) => {
//     const updated = [...invoiceItems];
//     updated[index][field] = value;

//     if (field === 'medicine_id') {
//       const medicine = medicines.find((m) => m.id === value);
//       if (medicine) {
//         updated[index].item_name = medicine.medicine_name;
//         updated[index].unit_price = medicine.unit_price;
//       }
//     }

//     if (field === 'quantity' || field === 'unit_price') {
//       const qty = parseFloat(updated[index].quantity) || 0;
//       const price = parseFloat(updated[index].unit_price) || 0;
//       updated[index].total_price = qty * price;
//     }

//     setInvoiceItems(updated);
//   };

//   const calculateSubtotal = () => {
//     return invoiceItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
//   };

//   const calculateTotal = () => {
//     const subtotal = calculateSubtotal();
//     const tax = parseFloat(formData.tax_amount) || 0;
//     const discount = parseFloat(formData.discount_amount) || 0;
//     return subtotal + tax - discount;
//   };

//   const resetForm = () => {
//     setEditingInvoice(null);
//     setFormData({
//       patient_id: '',
//       payment_method: 'cash',
//       tax_amount: '0',
//       discount_amount: '0',
//       notes: '',
//     });
//     setInvoiceItems([
//       {
//         medicine_id: '',
//         item_name: '',
//         quantity: '',
//         unit_price: '',
//         total_price: 0,
//       },
//     ]);
//   };

//   const getPaymentStatusColor = (status) => {
//     const colors = {
//       paid: 'bg-green-100 text-green-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       partially_paid: 'bg-orange-100 text-orange-800',
//       cancelled: 'bg-red-100 text-red-800',
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800';
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64 text-gray-600">
//           Loading invoices...
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
//         <div className="flex items-center justify-between mb-6">
//           <div>
//             <h1 className="text-2xl font-bold">Invoices</h1>
//             <p className="text-gray-500">Generate and manage patient invoices</p>
//           </div>
//           <button
//             onClick={() => setShowModal(true)}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="mr-2 h-4 w-4" />
//             New Invoice
//           </button>
//         </div>

//         <div className="grid gap-4">
//           {invoices.map((invoice) => (
//             <div
//               key={invoice.id}
//               className="border p-4 rounded-lg bg-white shadow-sm"
//             >
//               <div className="flex justify-between items-start mb-2">
//                 <div>
//                   <h2 className="font-semibold text-lg">{invoice.invoice_number}</h2>
//                   <span
//                     className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(
//                       invoice.payment_status
//                     )}`}
//                   >
//                     {invoice.payment_status}
//                   </span>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => downloadPDF(invoice)}
//                     className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
//                     title="Download PDF"
//                   >
//                     <Download className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => shareOnWhatsApp(invoice)}
//                     className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
//                     title="Share on WhatsApp"
//                   >
//                     <Share2 className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleEdit(invoice)}
//                     className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
//                     title="Edit"
//                   >
//                     <Edit className="h-4 w-4" />
//                   </button>
//                   <button
//                     onClick={() => handleDelete(invoice.id)}
//                     className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
//                     title="Delete"
//                   >
//                     <Trash2 className="h-4 w-4" />
//                   </button>
//                 </div>
//               </div>

//               <div className="text-gray-600 text-sm mb-3">
//                 <p><strong>Patient:</strong> {invoice.patient?.full_name}</p>
//                 <p><strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
//               </div>

//               <div className="flex justify-between items-center mb-3">
//                 <div>
//                   <p className="text-gray-700 font-medium text-lg">
//                     PKR {invoice.total_amount.toFixed(2)}
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {invoice.payment_method}
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <p className="font-medium text-sm mb-1">Items:</p>
//                 <ul className="list-disc list-inside text-gray-700 text-sm">
//                   {invoice.items?.map((item, idx) => (
//                     <li key={idx}>
//                       {item.item_name} (x{item.quantity}) — PKR{' '}
//                       {item.total_price.toFixed(2)}
//                     </li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           ))}
//         </div>

//         {showModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">
//                   {editingInvoice ? 'Edit Invoice' : 'New Invoice'}
//                 </h2>
//                 <button
//                   onClick={() => {
//                     setShowModal(false);
//                     resetForm();
//                   }}
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="h-5 w-5" />
//                 </button>
//               </div>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block mb-1 font-medium">Patient *</label>
//                   <select
//                     value={formData.patient_id}
//                     onChange={(e) =>
//                       setFormData({ ...formData, patient_id: e.target.value })
//                     }
//                     required
//                     disabled={editingInvoice !== null}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                   >
//                     <option value="">Select Patient</option>
//                     {patients.map((patient) => (
//                       <option key={patient.id} value={patient.id}>
//                         {patient.full_name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium">Payment Method</label>
//                   <select
//                     value={formData.payment_method}
//                     onChange={(e) =>
//                       setFormData({
//                         ...formData,
//                         payment_method: e.target.value,
//                       })
//                     }
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="cash">Cash</option>
//                     <option value="card">Card</option>
//                     <option value="bank">Bank Transfer</option>
//                     <option value="insurance">Insurance</option>
//                   </select>
//                 </div>

//                 <div>
//                   <div className="flex justify-between items-center mb-2">
//                     <label className="font-medium">Items</label>
//                     {!editingInvoice && (
//                       <button
//                         type="button"
//                         onClick={addItem}
//                         className="text-blue-600 hover:text-blue-800 text-sm"
//                       >
//                         + Add Item
//                       </button>
//                     )}
//                   </div>

//                   {invoiceItems.map((item, index) => (
//                     <div
//                       key={index}
//                       className="border p-3 rounded-lg mb-3 bg-gray-50"
//                     >
//                       <div className="grid grid-cols-2 gap-3 mb-2">
//                         <div>
//                           <label className="block text-sm mb-1">
//                             Medicine *
//                           </label>
//                           <select
//                             value={item.medicine_id}
//                             onChange={(e) =>
//                               updateItem(index, 'medicine_id', e.target.value)
//                             }
//                             required
//                             disabled={editingInvoice !== null}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                           >
//                             <option value="">Select Medicine</option>
//                             {medicines.map((med) => (
//                               <option key={med.id} value={med.id}>
//                                 {med.medicine_name} - PKR {med.unit_price} (
//                                 Stock: {med.quantity_in_stock})
//                               </option>
//                             ))}
//                           </select>
//                         </div>

//                         <div>
//                           <label className="block text-sm mb-1">
//                             Quantity *
//                           </label>
//                           <input
//                             type="number"
//                             value={item.quantity}
//                             onChange={(e) =>
//                               updateItem(index, 'quantity', e.target.value)
//                             }
//                             required
//                             min="1"
//                             disabled={editingInvoice !== null}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//                           />
//                         </div>
//                       </div>

//                       <p className="text-sm text-gray-600">
//                         Total: PKR {item.total_price.toFixed(2)}
//                       </p>

//                       {invoiceItems.length > 1 && !editingInvoice && (
//                         <button
//                           type="button"
//                           onClick={() => removeItem(index)}
//                           className="mt-2 text-red-600 hover:text-red-800 text-sm"
//                         >
//                           Remove Item
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm mb-1">Tax Amount</label>
//                     <input
//                       type="number"
//                       value={formData.tax_amount}
//                       onChange={(e) =>
//                         setFormData({ ...formData, tax_amount: e.target.value })
//                       }
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm mb-1">Discount</label>
//                     <input
//                       type="number"
//                       value={formData.discount_amount}
//                       onChange={(e) =>
//                         setFormData({
//                           ...formData,
//                           discount_amount: e.target.value,
//                         })
//                       }
//                       step="0.01"
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <p className="text-sm font-medium">
//                     Subtotal: PKR {calculateSubtotal().toFixed(2)}
//                   </p>
//                   <p className="text-lg font-semibold">
//                     Total: PKR {calculateTotal().toFixed(2)}
//                   </p>
//                 </div>

//                 <div>
//                   <label className="block mb-1 font-medium">Notes</label>
//                   <textarea
//                     value={formData.notes}
//                     onChange={(e) =>
//                       setFormData({ ...formData, notes: e.target.value })
//                     }
//                     rows="2"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="flex justify-end gap-3 mt-4">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setShowModal(false);
//                       resetForm();
//                     }}
//                     className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                   >
//                     {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }

//updated ui design for this page//
// src/app/invoices/page.js
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  Plus, Receipt, Download, X, Edit, Trash2, Share2, Search, Filter,
  DollarSign, Calendar, CreditCard, TrendingUp, Eye, ShoppingCart,
  FileText, CheckCircle, Clock, XCircle, AlertCircle
} from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('all');
  const [formData, setFormData] = useState({
    patient_id: '',
    payment_method: 'cash',
    tax_amount: '0',
    discount_amount: '0',
    notes: '',
  });
  const [invoiceItems, setInvoiceItems] = useState([
    {
      medicine_id: '',
      item_name: '',
      quantity: '',
      unit_price: '',
      total_price: 0,
    },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = invoices;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(invoice =>
        invoice.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.patient?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(invoice => invoice.payment_status === filterStatus);
    }

    // Payment method filter
    if (filterPaymentMethod !== 'all') {
      filtered = filtered.filter(invoice => invoice.payment_method === filterPaymentMethod);
    }

    setFilteredInvoices(filtered);
  }, [searchTerm, filterStatus, filterPaymentMethod, invoices]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const [invRes, patRes, medRes] = await Promise.all([
        fetch('/api/invoices', { headers }),
        fetch('/api/patients', { headers }),
        fetch('/api/inventory', { headers }),
      ]);

      const [invData, patData, medData] = await Promise.all([
        invRes.json(),
        patRes.json(),
        medRes.json(),
      ]);

      setInvoices(invData.invoices || []);
      setFilteredInvoices(invData.invoices || []);
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
      const url = editingInvoice 
        ? `/api/invoices/${editingInvoice.id}`
        : '/api/invoices';
      const method = editingInvoice ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: invoiceItems,
        }),
      });

      if (response.ok) {
        fetchData();
        setShowModal(false);
        resetForm();
        alert(`Invoice ${editingInvoice ? 'updated' : 'created'} successfully!`);
      } else {
        const error = await response.json();
        alert(error.error || `Failed to ${editingInvoice ? 'update' : 'create'} invoice`);
      }
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice');
    }
  };

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      patient_id: invoice.patient_id,
      payment_method: invoice.payment_method,
      tax_amount: invoice.tax_amount.toString(),
      discount_amount: invoice.discount_amount.toString(),
      notes: invoice.notes || '',
    });
    setInvoiceItems(
      invoice.items.map((item) => ({
        medicine_id: item.medicine_id,
        item_name: item.item_name,
        quantity: item.quantity.toString(),
        unit_price: item.unit_price.toString(),
        total_price: item.total_price,
      }))
    );
    setShowModal(true);
  };

  const handleViewDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        fetchData();
        alert('Invoice deleted successfully');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete invoice');
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice');
    }
  };

  const downloadPDF = async (invoice) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
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

  const shareOnWhatsApp = async (invoice) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/invoices/${invoice.id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        const phoneNumber = invoice.patient?.phone_number || '';
        const message = `Hello ${invoice.patient?.full_name}, here is your invoice ${invoice.invoice_number} for PKR ${invoice.total_amount.toFixed(2)}`;
        
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        alert('WhatsApp opened. You can now manually attach the downloaded PDF to your message.');
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoice.invoice_number}.pdf`;
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
    setInvoiceItems([
      ...invoiceItems,
      {
        medicine_id: '',
        item_name: '',
        quantity: '',
        unit_price: '',
        total_price: 0,
      },
    ]);
  };

  const removeItem = (index) => {
    setInvoiceItems(invoiceItems.filter((_, i) => i !== index));
  };

  const updateItem = (index, field, value) => {
    const updated = [...invoiceItems];
    updated[index][field] = value;

    if (field === 'medicine_id') {
      const medicine = medicines.find((m) => m.id === value);
      if (medicine) {
        updated[index].item_name = medicine.medicine_name;
        updated[index].unit_price = medicine.unit_price;
      }
    }

    if (field === 'quantity' || field === 'unit_price') {
      const qty = parseFloat(updated[index].quantity) || 0;
      const price = parseFloat(updated[index].unit_price) || 0;
      updated[index].total_price = qty * price;
    }

    setInvoiceItems(updated);
  };

  const calculateSubtotal = () => {
    return invoiceItems.reduce((sum, item) => sum + (item.total_price || 0), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = parseFloat(formData.tax_amount) || 0;
    const discount = parseFloat(formData.discount_amount) || 0;
    return subtotal + tax - discount;
  };

  const resetForm = () => {
    setEditingInvoice(null);
    setFormData({
      patient_id: '',
      payment_method: 'cash',
      tax_amount: '0',
      discount_amount: '0',
      notes: '',
    });
    setInvoiceItems([
      {
        medicine_id: '',
        item_name: '',
        quantity: '',
        unit_price: '',
        total_price: 0,
      },
    ]);
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      partially_paid: 'bg-orange-100 text-orange-800 border-orange-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  // Calculate statistics
  const stats = {
    total: invoices.length,
    totalRevenue: invoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    paid: invoices.filter(inv => inv.payment_status === 'paid').length,
    pending: invoices.filter(inv => inv.payment_status === 'pending').length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Invoice Management</h1>
              <p className="text-purple-100">Generate and track patient invoices and payments</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-semibold shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Invoice
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Receipt className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  PKR {stats.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Paid Invoices</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.paid}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <CheckCircle className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Clock className="w-7 h-7 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by invoice # or patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Method Filter */}
            <div>
              <select
                value={filterPaymentMethod}
                onChange={(e) => setFilterPaymentMethod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">All Payment Methods</option>
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank">Bank Transfer</option>
                <option value="insurance">Insurance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredInvoices.length}</span> of{' '}
            <span className="font-semibold text-gray-900">{invoices.length}</span> invoices
          </p>
        </div>

        {/* Invoices Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredInvoices.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
              <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No invoices found</p>
              <p className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-200 overflow-hidden"
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{invoice.invoice_number}</h3>
                      <p className="text-sm text-gray-600 mt-1">{invoice.patient?.full_name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getPaymentStatusColor(invoice.payment_status)}`}>
                      {getStatusIcon(invoice.payment_status)}
                      {invoice.payment_status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(invoice.invoice_date).toLocaleDateString()}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                  {/* Amount */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-2xl font-bold text-green-700">
                        PKR {invoice.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-lg">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center text-sm text-gray-700">
                    <CreditCard className="w-4 h-4 text-blue-600 mr-3" />
                    <span className="capitalize">{invoice.payment_method}</span>
                  </div>

                  {/* Items Count */}
                  <div className="flex items-center text-sm text-gray-700">
                    <ShoppingCart className="w-4 h-4 text-purple-600 mr-3" />
                    <span>{invoice.items?.length || 0} item(s)</span>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
                  <button
                    onClick={() => handleViewDetails(invoice)}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-800 font-semibold"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadPDF(invoice)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => shareOnWhatsApp(invoice)}
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Share on WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(invoice)}
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <h2 className="text-2xl font-bold">
                  {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
                </h2>
                <p className="text-purple-100 text-sm mt-1">
                  {editingInvoice ? 'Update invoice information' : 'Generate a new invoice for patient'}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Patient Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-purple-600" />
                  Invoice Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.patient_id}
                      onChange={(e) =>
                        setFormData({ ...formData, patient_id: e.target.value })
                      }
                      required
                      disabled={editingInvoice !== null}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
                    >
                      <option value="">Select Patient</option>
                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.full_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Method
                    </label>
                    <select
                      value={formData.payment_method}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          payment_method: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    >
                      <option value="cash">Cash</option>
                      <option value="card">Card</option>
                      <option value="bank">Bank Transfer</option>
                      <option value="insurance">Insurance</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <ShoppingCart className="w-5 h-5 mr-2 text-blue-600" />
                    Invoice Items
                  </h3>
                  {!editingInvoice && (
                    <button
                      type="button"
                      onClick={addItem}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      + Add Item
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {invoiceItems.map((item, index) => (
                    <div
                      key={index}
                      className="border-2 border-gray-200 p-4 rounded-lg bg-gray-50"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Medicine <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={item.medicine_id}
                            onChange={(e) =>
                              updateItem(index, 'medicine_id', e.target.value)
                            }
                            required
                            disabled={editingInvoice !== null}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
                          >
                            <option value="">Select Medicine</option>
                            {medicines.map((med) => (
                              <option key={med.id} value={med.id}>
                                {med.medicine_name} - PKR {med.unit_price} (Stock: {med.quantity_in_stock})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Quantity <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(index, 'quantity', e.target.value)
                            }
                            required
                            min="1"
                            disabled={editingInvoice !== null}
                            placeholder="Enter quantity"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100 transition-colors"
                          />
                        </div>
                      </div>

                      {/* Item Total */}
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Item Total:</span>
                        <span className="text-lg font-bold text-gray-900">
                          PKR {item.total_price.toFixed(2)}
                        </span>
                      </div>

                      {invoiceItems.length > 1 && !editingInvoice && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="mt-3 text-sm text-red-600 hover:text-red-800 font-semibold"
                        >
                          Remove Item
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Tax and Discount */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                  Additional Charges
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tax Amount (PKR)
                    </label>
                    <input
                      type="number"
                      value={formData.tax_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, tax_amount: e.target.value })
                      }
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Discount Amount (PKR)
                    </label>
                    <input
                      type="number"
                      value={formData.discount_amount}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discount_amount: e.target.value,
                        })
                      }
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Total Summary */}
              <div className="mb-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="text-xl font-bold text-gray-900">
                      PKR {calculateSubtotal().toFixed(2)}
                    </span>
                  </div>
                  {parseFloat(formData.tax_amount) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Tax:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        PKR {parseFloat(formData.tax_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {parseFloat(formData.discount_amount) > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Discount:</span>
                      <span className="text-lg font-semibold text-red-600">
                        - PKR {parseFloat(formData.discount_amount).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-green-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Grand Total:</span>
                      <span className="text-3xl font-bold text-green-700">
                        PKR {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes / Additional Information
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows="3"
                  placeholder="Add any additional notes or instructions..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-colors font-semibold shadow-md"
                >
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {showDetailsModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-6 py-4 flex items-center justify-between rounded-t-xl">
              <div>
                <h2 className="text-2xl font-bold">{selectedInvoice.invoice_number}</h2>
                <p className="text-purple-100 text-sm mt-1">Invoice Details</p>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status and Date */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold border flex items-center gap-2 w-fit ${getPaymentStatusColor(selectedInvoice.payment_status)}`}>
                    {getStatusIcon(selectedInvoice.payment_status)}
                    {selectedInvoice.payment_status}
                  </span>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Invoice Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(selectedInvoice.invoice_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Patient Information */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Patient Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Name:</span>
                    <span className="text-sm text-gray-900 font-semibold">
                      {selectedInvoice.patient?.full_name}
                    </span>
                  </div>
                  {selectedInvoice.patient?.phone_number && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Phone:</span>
                      <span className="text-sm text-gray-900">
                        {selectedInvoice.patient?.phone_number}
                      </span>
                    </div>
                  )}
                  {selectedInvoice.patient?.email && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">Email:</span>
                      <span className="text-sm text-gray-900">
                        {selectedInvoice.patient?.email}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                  Payment Information
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">Payment Method:</span>
                    <span className="text-sm text-gray-900 font-semibold capitalize">
                      {selectedInvoice.payment_method}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-purple-600" />
                  Invoice Items
                </h3>
                <div className="space-y-3">
                  {selectedInvoice.items?.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-lg border border-purple-200">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{item.item_name}</p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity} × PKR {item.unit_price.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-lg font-bold text-purple-700">
                          PKR {item.total_price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amount Breakdown */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Amount Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 font-medium">Subtotal:</span>
                    <span className="text-xl font-bold text-gray-900">
                      PKR {(selectedInvoice.subtotal || selectedInvoice.items.reduce((sum, item) => sum + item.total_price, 0)).toFixed(2)}
                    </span>
                  </div>
                  {selectedInvoice.tax_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Tax:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        PKR {selectedInvoice.tax_amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {selectedInvoice.discount_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 font-medium">Discount:</span>
                      <span className="text-lg font-semibold text-red-600">
                        - PKR {selectedInvoice.discount_amount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="pt-3 border-t-2 border-green-300">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900">Total Amount:</span>
                      <span className="text-3xl font-bold text-green-700">
                        PKR {selectedInvoice.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Notes</h3>
                  <p className="text-sm text-gray-700 bg-white p-4 rounded-lg">
                    {selectedInvoice.notes}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    downloadPDF(selectedInvoice);
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold inline-flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedInvoice);
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-lg hover:from-purple-700 hover:to-indigo-800 transition-colors font-semibold shadow-md"
                >
                  Edit Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
} 