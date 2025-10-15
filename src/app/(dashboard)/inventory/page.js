// // src/app/inventory/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Plus, AlertTriangle, Edit, Trash2, X, Package } from 'lucide-react';

// export default function InventoryPage() {
//   const [medicines, setMedicines] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [editingMedicine, setEditingMedicine] = useState(null);
//   const [filter, setFilter] = useState('all');
//   const [formData, setFormData] = useState({
//     medicine_name: '',
//     generic_name: '',
//     manufacturer: '',
//     category: '',
//     dosage_form: '',
//     strength: '',
//     unit_price: '',
//     quantity_in_stock: '',
//     reorder_level: '10',
//     expiry_date: '',
//     batch_number: '',
//   });

//   useEffect(() => {
//     fetchMedicines();
//   }, [filter]);

//   const fetchMedicines = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const url = filter === 'low-stock' ? '/api/inventory?filter=low-stock' : '/api/inventory';
//       const response = await fetch(url, {
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       const data = await response.json();
//       setMedicines(data.medicines || []);
//     } catch (error) {
//       console.error('Error fetching medicines:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const url = editingMedicine ? `/api/inventory/${editingMedicine.id}` : '/api/inventory';
//       const method = editingMedicine ? 'PUT' : 'POST';

//       const response = await fetch(url, {
//         method,
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//       });

//       if (response.ok) {
//         fetchMedicines();
//         setShowModal(false);
//         resetForm();
//       }
//     } catch (error) {
//       console.error('Error saving medicine:', error);
//     }
//   };

//   const handleEdit = (medicine) => {
//     setEditingMedicine(medicine);
//     setFormData({
//       medicine_name: medicine.medicine_name,
//       generic_name: medicine.generic_name || '',
//       manufacturer: medicine.manufacturer || '',
//       category: medicine.category || '',
//       dosage_form: medicine.dosage_form || '',
//       strength: medicine.strength || '',
//       unit_price: medicine.unit_price,
//       quantity_in_stock: medicine.quantity_in_stock,
//       reorder_level: medicine.reorder_level,
//       expiry_date: medicine.expiry_date || '',
//       batch_number: medicine.batch_number || '',
//     });
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     if (!confirm('Are you sure you want to delete this medicine?')) return;
//     try {
//       const token = localStorage.getItem('token');
//       await fetch(`/api/inventory/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${token}` },
//       });
//       fetchMedicines();
//     } catch (error) {
//       console.error('Error deleting medicine:', error);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       medicine_name: '',
//       generic_name: '',
//       manufacturer: '',
//       category: '',
//       dosage_form: '',
//       strength: '',
//       unit_price: '',
//       quantity_in_stock: '',
//       reorder_level: '10',
//       expiry_date: '',
//       batch_number: '',
//     });
//     setEditingMedicine(null);
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const isLowStock = (medicine) => medicine.quantity_in_stock <= medicine.reorder_level;
//   const isExpiringSoon = (medicine) => {
//     if (!medicine.expiry_date) return false;
//     const today = new Date();
//     const expiryDate = new Date(medicine.expiry_date);
//     const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
//     return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Medicine Inventory</h1>
//             <p className="text-gray-600 mt-1">Manage your Clinic&apos;s medicine stock</p>
//           </div>
//           <button
//             onClick={() => {
//               resetForm();
//               setShowModal(true);
//             }}
//             className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             <Plus className="w-5 h-5 mr-2" />
//             Add Medicine
//           </button>
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex space-x-2">
//           <button
//             onClick={() => setFilter('all')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             All Medicines
//           </button>
//           <button
//             onClick={() => setFilter('low-stock')}
//             className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//               filter === 'low-stock' ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//             }`}
//           >
//             Low Stock
//           </button>
//         </div>

//         {/* Medicines Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {medicines.map((medicine) => (
//             <div
//               key={medicine.id}
//               className={`bg-white rounded-xl shadow-sm p-6 border-2 transition-all ${
//                 isLowStock(medicine) ? 'border-orange-300' : 'border-gray-200'
//               }`}
//             >
//               <div className="flex items-start justify-between mb-4">
//                 <div className="flex items-center">
//                   <div className={`p-2 rounded-lg ${isLowStock(medicine) ? 'bg-orange-100' : 'bg-blue-100'}`}>
//                     <Package className={`w-6 h-6 ${isLowStock(medicine) ? 'text-orange-600' : 'text-blue-600'}`} />
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="font-semibold text-gray-900">{medicine.medicine_name}</h3>
//                     {medicine.generic_name && (
//                       <p className="text-xs text-gray-500">{medicine.generic_name}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {isLowStock(medicine) && (
//                 <div className="mb-3 flex items-center text-orange-600 bg-orange-50 px-3 py-2 rounded-lg">
//                   <AlertTriangle className="w-4 h-4 mr-2" />
//                   <span className="text-sm font-medium">Low Stock Alert</span>
//                 </div>
//               )}

//               {isExpiringSoon(medicine) && (
//                 <div className="mb-3 flex items-center text-red-600 bg-red-50 px-3 py-2 rounded-lg">
//                   <AlertTriangle className="w-4 h-4 mr-2" />
//                   <span className="text-sm font-medium">Expiring Soon</span>
//                 </div>
//               )}

//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Stock:</span>
//                   <span className={`font-semibold ${isLowStock(medicine) ? 'text-orange-600' : 'text-gray-900'}`}>
//                     {medicine.quantity_in_stock} units
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Reorder Level:</span>
//                   <span className="font-medium text-gray-900">{medicine.reorder_level}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Price:</span>
//                   <span className="font-semibold text-gray-900">PKR {medicine.unit_price}</span>
//                 </div>
//                 {medicine.strength && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Strength:</span>
//                     <span className="font-medium text-gray-900">{medicine.strength}</span>
//                   </div>
//                 )}
//                 {medicine.expiry_date && (
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Expiry:</span>
//                     <span className={`font-medium ${isExpiringSoon(medicine) ? 'text-red-600' : 'text-gray-900'}`}>
//                       {new Date(medicine.expiry_date).toLocaleDateString()}
//                     </span>
//                   </div>
//                 )}
//               </div>

//               <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
//                 <button
//                   onClick={() => handleEdit(medicine)}
//                   className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100"
//                 >
//                   <Edit className="w-4 h-4 mr-1" />
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(medicine.id)}
//                   className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
//                 >
//                   <Trash2 className="w-4 h-4 mr-1" />
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {medicines.length === 0 && (
//           <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//             <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
//             <p className="text-gray-500">No medicines found</p>
//           </div>
//         )}
//       </div>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
//             <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
//               <h2 className="text-xl font-bold text-gray-900">
//                 {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
//               </h2>
//               <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600">
//                 <X className="w-6 h-6" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
//                   <input
//                     type="text"
//                     name="medicine_name"
//                     value={formData.medicine_name}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Generic Name</label>
//                   <input
//                     type="text"
//                     name="generic_name"
//                     value={formData.generic_name}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
//                   <input
//                     type="text"
//                     name="manufacturer"
//                     value={formData.manufacturer}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                   <input
//                     type="text"
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., Antibiotic"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
//                   <select
//                     name="dosage_form"
//                     value={formData.dosage_form}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select Form</option>
//                     <option value="Tablet">Tablet</option>
//                     <option value="Capsule">Capsule</option>
//                     <option value="Syrup">Syrup</option>
//                     <option value="Injection">Injection</option>
//                     <option value="Cream">Cream</option>
//                     <option value="Drops">Drops</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
//                   <input
//                     type="text"
//                     name="strength"
//                     value={formData.strength}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="e.g., 500mg"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (PKR) *</label>
//                   <input
//                     type="number"
//                     name="unit_price"
//                     value={formData.unit_price}
//                     onChange={handleChange}
//                     required
//                     step="0.01"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock *</label>
//                   <input
//                     type="number"
//                     name="quantity_in_stock"
//                     value={formData.quantity_in_stock}
//                     onChange={handleChange}
//                     required
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Reorder Level</label>
//                   <input
//                     type="number"
//                     name="reorder_level"
//                     value={formData.reorder_level}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                   <input
//                     type="date"
//                     name="expiry_date"
//                     value={formData.expiry_date}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
//                   <input
//                     type="text"
//                     name="batch_number"
//                     value={formData.batch_number}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div className="flex justify-end space-x-3 pt-4">
//                 <button
//                   type="button"
//                   onClick={() => { setShowModal(false); resetForm(); }}
//                   className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//                 >
//                   {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </DashboardLayout>
//   );
// }






// src/app/inventory/page.js
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Plus, AlertTriangle, Edit, Trash2, X, Package, Search, Filter, Download, TrendingDown, TrendingUp, Calendar, DollarSign, Box, BarChart3, FileText, Eye, RefreshCw } from 'lucide-react';

export default function InventoryPage() {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [formData, setFormData] = useState({
    medicine_name: '',
    generic_name: '',
    manufacturer: '',
    category: '',
    dosage_form: '',
    strength: '',
    unit_price: '',
    quantity_in_stock: '',
    reorder_level: '10',
    expiry_date: '',
    batch_number: '',
    rack_location: '',
    supplier: '',
    notes: ''
  });

  useEffect(() => {
    fetchMedicines();
  }, [filter]);

  const fetchMedicines = async () => {
    try {
      const token = localStorage.getItem('token');
      const url = filter === 'low-stock' ? '/api/inventory?filter=low-stock' : '/api/inventory';
      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setMedicines(data.medicines || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingMedicine ? `/api/inventory/${editingMedicine.id}` : '/api/inventory';
      const method = editingMedicine ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchMedicines();
        setShowModal(false);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving medicine:', error);
    }
  };

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setFormData({
      medicine_name: medicine.medicine_name,
      generic_name: medicine.generic_name || '',
      manufacturer: medicine.manufacturer || '',
      category: medicine.category || '',
      dosage_form: medicine.dosage_form || '',
      strength: medicine.strength || '',
      unit_price: medicine.unit_price,
      quantity_in_stock: medicine.quantity_in_stock,
      reorder_level: medicine.reorder_level,
      expiry_date: medicine.expiry_date || '',
      batch_number: medicine.batch_number || '',
      rack_location: medicine.rack_location || '',
      supplier: medicine.supplier || '',
      notes: medicine.notes || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this medicine?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/inventory/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchMedicines();
    } catch (error) {
      console.error('Error deleting medicine:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      medicine_name: '',
      generic_name: '',
      manufacturer: '',
      category: '',
      dosage_form: '',
      strength: '',
      unit_price: '',
      quantity_in_stock: '',
      reorder_level: '10',
      expiry_date: '',
      batch_number: '',
      rack_location: '',
      supplier: '',
      notes: ''
    });
    setEditingMedicine(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isLowStock = (medicine) => medicine.quantity_in_stock <= medicine.reorder_level;
  const isExpiringSoon = (medicine) => {
    if (!medicine.expiry_date) return false;
    const today = new Date();
    const expiryDate = new Date(medicine.expiry_date);
    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  const filteredMedicines = medicines
    .filter(med => {
      if (filter === 'expiring') return isExpiringSoon(med);
      return true;
    })
    .filter(med => 
      med.medicine_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.generic_name && med.generic_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (med.category && med.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.medicine_name.localeCompare(b.medicine_name);
      if (sortBy === 'stock') return a.quantity_in_stock - b.quantity_in_stock;
      if (sortBy === 'price') return a.unit_price - b.unit_price;
      if (sortBy === 'expiry') return new Date(a.expiry_date || '9999') - new Date(b.expiry_date || '9999');
      return 0;
    });

  const stats = {
    total: medicines.length,
    lowStock: medicines.filter(isLowStock).length,
    expiring: medicines.filter(isExpiringSoon).length,
    totalValue: medicines.reduce((sum, m) => sum + (m.unit_price * m.quantity_in_stock), 0)
  };

  const viewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setShowDetailsModal(true);
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Medicine Inventory</h1>
              <p className="text-blue-100">Comprehensive stock management system</p>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Medicine
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Medicines</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="p-4 bg-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.lowStock}</p>
              </div>
              <div className="p-4 bg-orange-100 rounded-xl">
                <TrendingDown className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.expiring}</p>
              </div>
              <div className="p-4 bg-red-100 rounded-xl">
                <Calendar className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">PKR {stats.totalValue.toFixed(0)}</p>
              </div>
              <div className="p-4 bg-green-100 rounded-xl">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search medicines, generic name, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Sort By */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="price">Sort by Price</option>
              <option value="expiry">Sort by Expiry</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-xl transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <Box className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-xl transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                <FileText className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'all' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Medicines ({medicines.length})
            </button>
            <button
              onClick={() => setFilter('low-stock')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'low-stock' ? 'bg-orange-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Low Stock ({stats.lowStock})
            </button>
            <button
              onClick={() => setFilter('expiring')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === 'expiring' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Expiring Soon ({stats.expiring})
            </button>
          </div>
        </div>

        {/* Medicines Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine.id}
                className={`bg-white rounded-xl shadow-lg hover:shadow-2xl p-6 border-2 transition-all transform hover:-translate-y-1 ${
                  isLowStock(medicine) ? 'border-orange-300 bg-orange-50' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center flex-1">
                    <div className={`p-3 rounded-xl ${isLowStock(medicine) ? 'bg-orange-200' : 'bg-blue-100'} shadow-md`}>
                      <Package className={`w-6 h-6 ${isLowStock(medicine) ? 'text-orange-700' : 'text-blue-600'}`} />
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold text-gray-900 text-lg">{medicine.medicine_name}</h3>
                      {medicine.generic_name && (
                        <p className="text-sm text-gray-600">{medicine.generic_name}</p>
                      )}
                      {medicine.category && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                          {medicine.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isLowStock(medicine) && (
                  <div className="mb-3 flex items-center text-orange-700 bg-orange-100 px-3 py-2 rounded-lg border border-orange-300">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Low Stock Alert</span>
                  </div>
                )}

                {isExpiringSoon(medicine) && (
                  <div className="mb-3 flex items-center text-red-700 bg-red-100 px-3 py-2 rounded-lg border border-red-300">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    <span className="text-sm font-semibold">Expiring Soon</span>
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <span className="text-gray-600 font-medium">Stock:</span>
                    <span className={`font-bold text-lg ${isLowStock(medicine) ? 'text-orange-600' : 'text-green-600'}`}>
                      {medicine.quantity_in_stock} units
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reorder Level:</span>
                    <span className="font-semibold text-gray-900">{medicine.reorder_level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Price:</span>
                    <span className="font-bold text-blue-600">PKR {medicine.unit_price}</span>
                  </div>
                  {medicine.strength && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strength:</span>
                      <span className="font-semibold text-gray-900">{medicine.strength}</span>
                    </div>
                  )}
                  {medicine.rack_location && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-semibold text-gray-900">{medicine.rack_location}</span>
                    </div>
                  )}
                  {medicine.expiry_date && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Expiry:</span>
                      <span className={`font-semibold ${isExpiringSoon(medicine) ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(medicine.expiry_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                  <button
                    onClick={() => viewDetails(medicine)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 font-medium transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(medicine)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 font-medium transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(medicine.id)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm bg-red-50 text-red-700 rounded-lg hover:bg-red-100 font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Medicine</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Expiry</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredMedicines.map((medicine) => (
                    <tr key={medicine.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{medicine.medicine_name}</p>
                          <p className="text-sm text-gray-600">{medicine.generic_name}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                          {medicine.category || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${isLowStock(medicine) ? 'text-orange-600' : 'text-green-600'}`}>
                          {medicine.quantity_in_stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">PKR {medicine.unit_price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={isExpiringSoon(medicine) ? 'text-red-600 font-semibold' : 'text-gray-600'}>
                          {medicine.expiry_date ? new Date(medicine.expiry_date).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {isLowStock(medicine) && (
                          <span className="px-3 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full">
                            Low Stock
                          </span>
                        )}
                        {isExpiringSoon(medicine) && (
                          <span className="px-3 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full ml-1">
                            Expiring
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => viewDetails(medicine)}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(medicine)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(medicine.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredMedicines.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Package className="w-20 h-20 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-medium">No medicines found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or add a new medicine</p>
          </div>
        )}
      </div>

      {/* Add/Edit Medicine Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">
                {editingMedicine ? 'Edit Medicine' : 'Add New Medicine'}
              </h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 bg-blue-50 p-4 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    Basic Information
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medicine Name *</label>
                  <input
                    type="text"
                    name="medicine_name"
                    value={formData.medicine_name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Paracetamol"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Generic Name</label>
                  <input
                    type="text"
                    name="generic_name"
                    value={formData.generic_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Acetaminophen"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={formData.manufacturer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., GSK, Pfizer"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., Antibiotic, Analgesic"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Dosage Form</label>
                  <select
                    name="dosage_form"
                    value={formData.dosage_form}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white"
                  >
                    <option value="">Select Form</option>
                    <option value="Tablet">Tablet</option>
                    <option value="Capsule">Capsule</option>
                    <option value="Syrup">Syrup</option>
                    <option value="Injection">Injection</option>
                    <option value="Cream">Cream</option>
                    <option value="Drops">Drops</option>
                    <option value="Suspension">Suspension</option>
                    <option value="Ointment">Ointment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Strength</label>
                  <input
                    type="text"
                    name="strength"
                    value={formData.strength}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., 500mg, 250ml"
                  />
                </div>

                <div className="md:col-span-2 bg-green-50 p-4 rounded-xl border border-green-200 mt-4">
                  <h3 className="text-lg font-semibold text-green-900 mb-2 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2" />
                    Pricing & Inventory
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Unit Price (PKR) *</label>
                  <input
                    type="number"
                    name="unit_price"
                    value={formData.unit_price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity in Stock *</label>
                  <input
                    type="number"
                    name="quantity_in_stock"
                    value={formData.quantity_in_stock}
                    onChange={handleChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reorder Level</label>
                  <input
                    type="number"
                    name="reorder_level"
                    value={formData.reorder_level}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="10"
                  />
                  <p className="text-xs text-gray-500 mt-1">Alert when stock falls below this level</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Rack Location</label>
                  <input
                    type="text"
                    name="rack_location"
                    value={formData.rack_location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., A-12, B-05"
                  />
                </div>

                <div className="md:col-span-2 bg-purple-50 p-4 rounded-xl border border-purple-200 mt-4">
                  <h3 className="text-lg font-semibold text-purple-900 mb-2 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    Additional Details
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Expiry Date</label>
                  <input
                    type="date"
                    name="expiry_date"
                    value={formData.expiry_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Batch Number</label>
                  <input
                    type="text"
                    name="batch_number"
                    value={formData.batch_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="e.g., BT2024001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Supplier</label>
                  <input
                    type="text"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    placeholder="Supplier name"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    placeholder="Additional notes about this medicine..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  {editingMedicine ? 'Update Medicine' : 'Add Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-6 flex items-center justify-between rounded-t-2xl">
              <h2 className="text-2xl font-bold">Medicine Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-start gap-6 mb-8 pb-6 border-b-2 border-gray-200">
                <div className="p-4 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl shadow-lg">
                  <Package className="w-12 h-12 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedMedicine.medicine_name}</h3>
                  {selectedMedicine.generic_name && (
                    <p className="text-lg text-gray-600 mb-3">{selectedMedicine.generic_name}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {selectedMedicine.category && (
                      <span className="px-4 py-1.5 text-sm font-semibold bg-blue-100 text-blue-700 rounded-full">
                        {selectedMedicine.category}
                      </span>
                    )}
                    {isLowStock(selectedMedicine) && (
                      <span className="px-4 py-1.5 text-sm font-semibold bg-orange-100 text-orange-700 rounded-full">
                        Low Stock
                      </span>
                    )}
                    {isExpiringSoon(selectedMedicine) && (
                      <span className="px-4 py-1.5 text-sm font-semibold bg-red-100 text-red-700 rounded-full">
                        Expiring Soon
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-700 mb-1">Manufacturer</p>
                  <p className="text-lg font-bold text-gray-900">{selectedMedicine.manufacturer || 'N/A'}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border-2 border-green-200">
                  <p className="text-sm font-semibold text-green-700 mb-1">Dosage Form</p>
                  <p className="text-lg font-bold text-gray-900">{selectedMedicine.dosage_form || 'N/A'}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-700 mb-1">Strength</p>
                  <p className="text-lg font-bold text-gray-900">{selectedMedicine.strength || 'N/A'}</p>
                </div>

                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border-2 border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-700 mb-1">Unit Price</p>
                  <p className="text-lg font-bold text-gray-900">PKR {selectedMedicine.unit_price}</p>
                </div>

                <div className={`p-5 rounded-xl border-2 ${isLowStock(selectedMedicine) ? 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200' : 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200'}`}>
                  <p className={`text-sm font-semibold mb-1 ${isLowStock(selectedMedicine) ? 'text-orange-700' : 'text-emerald-700'}`}>Current Stock</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedMedicine.quantity_in_stock} units</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-5 rounded-xl border-2 border-amber-200">
                  <p className="text-sm font-semibold text-amber-700 mb-1">Reorder Level</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedMedicine.reorder_level} units</p>
                </div>

                {selectedMedicine.rack_location && (
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-5 rounded-xl border-2 border-cyan-200">
                    <p className="text-sm font-semibold text-cyan-700 mb-1">Rack Location</p>
                    <p className="text-lg font-bold text-gray-900">{selectedMedicine.rack_location}</p>
                  </div>
                )}

                {selectedMedicine.batch_number && (
                  <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-5 rounded-xl border-2 border-pink-200">
                    <p className="text-sm font-semibold text-pink-700 mb-1">Batch Number</p>
                    <p className="text-lg font-bold text-gray-900">{selectedMedicine.batch_number}</p>
                  </div>
                )}

                {selectedMedicine.expiry_date && (
                  <div className={`p-5 rounded-xl border-2 ${isExpiringSoon(selectedMedicine) ? 'bg-gradient-to-br from-red-50 to-red-100 border-red-200' : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'}`}>
                    <p className={`text-sm font-semibold mb-1 ${isExpiringSoon(selectedMedicine) ? 'text-red-700' : 'text-slate-700'}`}>Expiry Date</p>
                    <p className="text-lg font-bold text-gray-900">{new Date(selectedMedicine.expiry_date).toLocaleDateString()}</p>
                  </div>
                )}

                {selectedMedicine.supplier && (
                  <div className="bg-gradient-to-br from-violet-50 to-violet-100 p-5 rounded-xl border-2 border-violet-200">
                    <p className="text-sm font-semibold text-violet-700 mb-1">Supplier</p>
                    <p className="text-lg font-bold text-gray-900">{selectedMedicine.supplier}</p>
                  </div>
                )}

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-5 rounded-xl border-2 border-teal-200">
                  <p className="text-sm font-semibold text-teal-700 mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900">PKR {(selectedMedicine.unit_price * selectedMedicine.quantity_in_stock).toFixed(2)}</p>
                </div>
              </div>

              {selectedMedicine.notes && (
                <div className="mt-6 bg-gray-50 p-5 rounded-xl border-2 border-gray-200">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Notes</p>
                  <p className="text-gray-900">{selectedMedicine.notes}</p>
                </div>
              )}

              <div className="flex gap-3 mt-8 pt-6 border-t-2 border-gray-200">
                <button
                  onClick={() => {
                    setShowDetailsModal(false);
                    handleEdit(selectedMedicine);
                  }}
                  className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <Edit className="w-5 h-5 mr-2" />
                  Edit Medicine
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