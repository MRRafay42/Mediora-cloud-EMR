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

'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Plus, Receipt, Download, X, Edit, Trash2, Share2 } from 'lucide-react';

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
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
        
        // For WhatsApp sharing, we need the patient's phone number
        const phoneNumber = invoice.patient?.phone_number || '';
        const message = `Hello ${invoice.patient?.full_name}, here is your invoice ${invoice.invoice_number} for PKR ${invoice.total_amount.toFixed(2)}`;
        
        // Open WhatsApp with pre-filled message
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        // Note: The PDF will need to be sent manually in WhatsApp
        alert('WhatsApp opened. You can now manually attach the downloaded PDF to your message.');
        
        // Trigger download so user has the file to attach
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
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      partially_paid: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64 text-gray-600">
          Loading invoices...
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
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Invoices</h1>
            <p className="text-gray-500">Generate and manage patient invoices</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </button>
        </div>

        <div className="grid gap-4">
          {invoices.map((invoice) => (
            <div
              key={invoice.id}
              className="border p-4 rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h2 className="font-semibold text-lg">{invoice.invoice_number}</h2>
                  <span
                    className={`px-2 py-1 rounded text-sm ${getPaymentStatusColor(
                      invoice.payment_status
                    )}`}
                  >
                    {invoice.payment_status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => downloadPDF(invoice)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Download PDF"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => shareOnWhatsApp(invoice)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                    title="Share on WhatsApp"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(invoice)}
                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(invoice.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="text-gray-600 text-sm mb-3">
                <p><strong>Patient:</strong> {invoice.patient?.full_name}</p>
                <p><strong>Date:</strong> {new Date(invoice.invoice_date).toLocaleDateString()}</p>
              </div>

              <div className="flex justify-between items-center mb-3">
                <div>
                  <p className="text-gray-700 font-medium text-lg">
                    PKR {invoice.total_amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {invoice.payment_method}
                  </p>
                </div>
              </div>

              <div>
                <p className="font-medium text-sm mb-1">Items:</p>
                <ul className="list-disc list-inside text-gray-700 text-sm">
                  {invoice.items?.map((item, idx) => (
                    <li key={idx}>
                      {item.item_name} (x{item.quantity}) — PKR{' '}
                      {item.total_price.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {editingInvoice ? 'Edit Invoice' : 'New Invoice'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Patient *</label>
                  <select
                    value={formData.patient_id}
                    onChange={(e) =>
                      setFormData({ ...formData, patient_id: e.target.value })
                    }
                    required
                    disabled={editingInvoice !== null}
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

                <div>
                  <label className="block mb-1 font-medium">Payment Method</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        payment_method: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank">Bank Transfer</option>
                    <option value="insurance">Insurance</option>
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="font-medium">Items</label>
                    {!editingInvoice && (
                      <button
                        type="button"
                        onClick={addItem}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        + Add Item
                      </button>
                    )}
                  </div>

                  {invoiceItems.map((item, index) => (
                    <div
                      key={index}
                      className="border p-3 rounded-lg mb-3 bg-gray-50"
                    >
                      <div className="grid grid-cols-2 gap-3 mb-2">
                        <div>
                          <label className="block text-sm mb-1">
                            Medicine *
                          </label>
                          <select
                            value={item.medicine_id}
                            onChange={(e) =>
                              updateItem(index, 'medicine_id', e.target.value)
                            }
                            required
                            disabled={editingInvoice !== null}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          >
                            <option value="">Select Medicine</option>
                            {medicines.map((med) => (
                              <option key={med.id} value={med.id}>
                                {med.medicine_name} - PKR {med.unit_price} (
                                Stock: {med.quantity_in_stock})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm mb-1">
                            Quantity *
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
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <p className="text-sm text-gray-600">
                        Total: PKR {item.total_price.toFixed(2)}
                      </p>

                      {invoiceItems.length > 1 && !editingInvoice && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="mt-2 text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove Item
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Tax Amount</label>
                    <input
                      type="number"
                      value={formData.tax_amount}
                      onChange={(e) =>
                        setFormData({ ...formData, tax_amount: e.target.value })
                      }
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Discount</label>
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-2">
                  <p className="text-sm font-medium">
                    Subtotal: PKR {calculateSubtotal().toFixed(2)}
                  </p>
                  <p className="text-lg font-semibold">
                    Total: PKR {calculateTotal().toFixed(2)}
                  </p>
                </div>

                <div>
                  <label className="block mb-1 font-medium">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3 mt-4">
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
                    {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}