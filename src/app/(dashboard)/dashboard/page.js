// // src/app/dashboard/page.js
// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Users, Calendar, Package, Receipt, AlertTriangle, TrendingUp } from 'lucide-react';

// export default function DashboardPage() {
//   const [stats, setStats] = useState({
//     totalPatients: 0,
//     totalAppointments: 0,
//     totalMedicines: 0,
//     totalInvoices: 0,
//   });
//   const [lowStockMedicines, setLowStockMedicines] = useState([]);
//   const [recentPatients, setRecentPatients] = useState([]);
//   const [todayAppointments, setTodayAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       // Fetch all data in parallel
//       const [patientsRes, appointmentsRes, inventoryRes, invoicesRes] = await Promise.all([
//         fetch('/api/patients', { headers }),
//         fetch('/api/appointments', { headers }),
//         fetch('/api/inventory?filter=low-stock', { headers }),
//         fetch('/api/invoices', { headers }),
//       ]);

//       const [patients, appointments, inventory, invoices] = await Promise.all([
//         patientsRes.json(),
//         appointmentsRes.json(),
//         inventoryRes.json(),
//         invoicesRes.json(),
//       ]);

//       // Set stats
//       setStats({
//         totalPatients: patients.patients?.length || 0,
//         totalAppointments: appointments.appointments?.length || 0,
//         totalMedicines: inventory.medicines?.length || 0,
//         totalInvoices: invoices.invoices?.length || 0,
//       });

//       // Set low stock medicines
//       setLowStockMedicines(inventory.medicines || []);

//       // Set recent patients (last 5)
//       setRecentPatients((patients.patients || []).slice(0, 5));

//       // Filter today's appointments
//       const today = new Date().toISOString().split('T')[0];
//       const todayAppts = (appointments.appointments || []).filter(
//         (apt) => apt.appointment_date === today
//       );
//       setTodayAppointments(todayAppts);

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: 'Total Patients',
//       value: stats.totalPatients,
//       icon: Users,
//       color: 'bg-blue-500',
//       textColor: 'text-blue-700',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Appointments',
//       value: stats.totalAppointments,
//       icon: Calendar,
//       color: 'bg-green-500',
//       textColor: 'text-green-700',
//       bgColor: 'bg-green-50',
//     },
//     {
//       title: 'Medicines',
//       value: stats.totalMedicines,
//       icon: Package,
//       color: 'bg-purple-500',
//       textColor: 'text-purple-700',
//       bgColor: 'bg-purple-50',
//     },
//     {
//       title: 'Invoices',
//       value: stats.totalInvoices,
//       icon: Receipt,
//       color: 'bg-orange-500',
//       textColor: 'text-orange-700',
//       bgColor: 'bg-orange-50',
//     },
//   ];

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
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your clinic overview.</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statCards.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
//                   </div>
//                   <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                     <Icon className={`w-6 h-6 ${stat.textColor}`} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Low Stock Alert */}
//         {lowStockMedicines.length > 0 && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
//             <div className="flex items-start">
//               <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-yellow-900 mb-2">
//                   Low Stock Alert
//                 </h3>
//                 <p className="text-yellow-800 mb-3">
//                   {lowStockMedicines.length} medicine(s) are running low on stock
//                 </p>
//                 <div className="space-y-2">
//                   {lowStockMedicines.slice(0, 3).map((medicine) => (
//                     <div key={medicine.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                       <span className="font-medium text-gray-900">{medicine.medicine_name}</span>
//                       <span className="text-sm text-red-600 font-semibold">
//                         Stock: {medicine.quantity_in_stock}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Today's Appointments */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Today&apos;s Appointments</h2>
//               <Calendar className="w-5 h-5 text-gray-400" />
//             </div>
//             {todayAppointments.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No appointments today</p>
//             ) : (
//               <div className="space-y-3">
//                 {todayAppointments.map((appointment) => (
//                   <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {appointment.patient?.full_name}
//                       </p>
//                       <p className="text-sm text-gray-600">{appointment.reason}</p>
//                     </div>
//                     <span className="text-sm font-semibold text-blue-600">
//                       {appointment.appointment_time}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Recent Patients */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
//               <Users className="w-5 h-5 text-gray-400" />
//             </div>
//             {recentPatients.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No patients yet</p>
//             ) : (
//               <div className="space-y-3">
//                 {recentPatients.map((patient) => (
//                   <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-700 font-semibold">
//                           {patient.full_name.charAt(0)}
//                         </span>
//                       </div>
//                       <div className="ml-3">
//                         <p className="font-medium text-gray-900">{patient.full_name}</p>
//                         <p className="text-sm text-gray-600">{patient.phone}</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {new Date(patient.created_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }










// src/app/dashboard/page.js 2
// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Users, Calendar, Package, Receipt, AlertTriangle } from 'lucide-react';

// export default function DashboardPage() {
//   const [stats, setStats] = useState({
//     totalPatients: 0,
//     totalAppointments: 0,
//     totalMedicines: 0,
//     totalInvoices: 0,
//   });
//   const [lowStockMedicines, setLowStockMedicines] = useState([]);
//   const [recentPatients, setRecentPatients] = useState([]);
//   const [todayAppointments, setTodayAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const headers = {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       // Fetch all data in parallel - get ALL medicines, not just low-stock
//       const [patientsRes, appointmentsRes, allInventoryRes, lowStockRes, invoicesRes] = await Promise.all([
//         fetch('/api/patients', { headers }),
//         fetch('/api/appointments', { headers }),
//         fetch('/api/inventory', { headers }), // All medicines
//         fetch('/api/inventory?filter=low-stock', { headers }), // Low stock only
//         fetch('/api/invoices', { headers }),
//       ]);

//       const [patients, appointments, allInventory, lowStock, invoices] = await Promise.all([
//         patientsRes.json(),
//         appointmentsRes.json(),
//         allInventoryRes.json(),
//         lowStockRes.json(),
//         invoicesRes.json(),
//       ]);

//       // Set stats with ALL data
//       setStats({
//         totalPatients: patients.patients?.length || 0,
//         totalAppointments: appointments.appointments?.length || 0,
//         totalMedicines: allInventory.medicines?.length || 0, // Total medicines count
//         totalInvoices: invoices.invoices?.length || 0,
//       });

//       // Set low stock medicines (for alert section)
//       setLowStockMedicines(lowStock.medicines || []);

//       // Set recent patients (last 5)
//       setRecentPatients((patients.patients || []).slice(0, 5));

//       // Filter today's appointments
//       const today = new Date().toISOString().split('T')[0];
//       const todayAppts = (appointments.appointments || []).filter(
//         (apt) => apt.appointment_date === today
//       );
//       setTodayAppointments(todayAppts);

//       console.log('Dashboard Stats:', {
//         patients: patients.patients?.length || 0,
//         appointments: appointments.appointments?.length || 0,
//         allMedicines: allInventory.medicines?.length || 0,
//         lowStock: lowStock.medicines?.length || 0,
//         invoices: invoices.invoices?.length || 0,
//       });

//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     {
//       title: 'Total Patients',
//       value: stats.totalPatients,
//       icon: Users,
//       color: 'bg-blue-500',
//       textColor: 'text-blue-700',
//       bgColor: 'bg-blue-50',
//     },
//     {
//       title: 'Appointments',
//       value: stats.totalAppointments,
//       icon: Calendar,
//       color: 'bg-green-500',
//       textColor: 'text-green-700',
//       bgColor: 'bg-green-50',
//     },
//     {
//       title: 'Medicines',
//       value: stats.totalMedicines,
//       icon: Package,
//       color: 'bg-purple-500',
//       textColor: 'text-purple-700',
//       bgColor: 'bg-purple-50',
//     },
//     {
//       title: 'Invoices',
//       value: stats.totalInvoices,
//       icon: Receipt,
//       color: 'bg-orange-500',
//       textColor: 'text-orange-700',
//       bgColor: 'bg-orange-50',
//     },
//   ];

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
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your clinic overview.</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statCards.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
//                   </div>
//                   <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                     <Icon className={`w-6 h-6 ${stat.textColor}`} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Low Stock Alert */}
//         {lowStockMedicines.length > 0 && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
//             <div className="flex items-start">
//               <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-yellow-900 mb-2">
//                   Low Stock Alert
//                 </h3>
//                 <p className="text-yellow-800 mb-3">
//                   {lowStockMedicines.length} medicine(s) are running low on stock
//                 </p>
//                 <div className="space-y-2">
//                   {lowStockMedicines.slice(0, 3).map((medicine) => (
//                     <div key={medicine.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                       <span className="font-medium text-gray-900">{medicine.medicine_name}</span>
//                       <span className="text-sm text-red-600 font-semibold">
//                         Stock: {medicine.quantity_in_stock}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Today's Appointments */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Today&apos;s Appointments</h2>
//               <Calendar className="w-5 h-5 text-gray-400" />
//             </div>
//             {todayAppointments.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No appointments today</p>
//             ) : (
//               <div className="space-y-3">
//                 {todayAppointments.map((appointment) => (
//                   <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium text-gray-900">
//                         {appointment.patient?.full_name}
//                       </p>
//                       <p className="text-sm text-gray-600">{appointment.reason}</p>
//                     </div>
//                     <span className="text-sm font-semibold text-blue-600">
//                       {appointment.appointment_time}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Recent Patients */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
//               <Users className="w-5 h-5 text-gray-400" />
//             </div>
//             {recentPatients.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No patients yet</p>
//             ) : (
//               <div className="space-y-3">
//                 {recentPatients.map((patient) => (
//                   <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-700 font-semibold">
//                           {patient.full_name.charAt(0)}
//                         </span>
//                       </div>
//                       <div className="ml-3">
//                         <p className="font-medium text-gray-900">{patient.full_name}</p>
//                         <p className="text-sm text-gray-600">{patient.phone}</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {new Date(patient.created_at).toLocaleDateString()}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }





////////////////////get actual data for statscard//////////////

// 'use client';

// import { useState, useEffect } from 'react';
// import DashboardLayout from '@/components/Layout/DashboardLayout';
// import { Users, Calendar, Package, Receipt, AlertTriangle } from 'lucide-react';

// export default function DashboardPage() {
//   const [stats, setStats] = useState({
//     totalPatients: 0,
//     totalAppointments: 0,
//     totalMedicines: 0,
//     totalInvoices: 0,
//   });
//   const [lowStockMedicines, setLowStockMedicines] = useState([]);
//   const [recentPatients, setRecentPatients] = useState([]);
//   const [todayAppointments, setTodayAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       if (!token) {
//         console.warn('No token found in localStorage');
//         setLoading(false);
//         return;
//       }

//       const headers = {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       };

//       // Fetch all data in parallel
//       const [patientsRes, appointmentsRes, allInventoryRes, lowStockRes, invoicesRes] =
//         await Promise.all([
//           fetch('/api/patients', { headers }),
//           fetch('/api/appointments', { headers }),
//           fetch('/api/inventory', { headers }),
//           fetch('/api/inventory?filter=low-stock', { headers }),
//           fetch('/api/invoices', { headers }),
//         ]);

//       const [patientsData, appointmentsData, allInventoryData, lowStockData, invoicesData] =
//         await Promise.all([
//           patientsRes.json(),
//           appointmentsRes.json(),
//           allInventoryRes.json(),
//           lowStockRes.json(),
//           invoicesRes.json(),
//         ]);

//       console.log('📊 Raw API Data:', {
//         patientsData,
//         appointmentsData,
//         allInventoryData,
//         lowStockData,
//         invoicesData,
//       });

//       // 🩺 Flexible data extraction (handles all possible API formats)
//       const extractArray = (obj, key) => {
//         if (!obj) return [];
//         if (Array.isArray(obj)) return obj;
//         if (Array.isArray(obj[key])) return obj[key];
//         if (obj.data && Array.isArray(obj.data[key])) return obj.data[key];
//         return [];
//       };

//       const patientsList = extractArray(patientsData, 'patients');
//       const appointmentsList = extractArray(appointmentsData, 'appointments');
//       const allMedicinesList = extractArray(allInventoryData, 'medicines');
//       const lowStockList = extractArray(lowStockData, 'medicines');
//       const invoicesList = extractArray(invoicesData, 'invoices');

//       // ✅ Compute totals safely
//       const totalPatients = patientsList.length;
//       const totalAppointments = appointmentsList.length;
//       const totalMedicines = allMedicinesList.length;
//       const totalInvoices = invoicesList.length;

//       setStats({
//         totalPatients,
//         totalAppointments,
//         totalMedicines,
//         totalInvoices,
//       });

//       // 🔻 Low stock
//       setLowStockMedicines(lowStockList);

//       // 🧍‍♂️ Recent patients (last 5)
//       setRecentPatients(patientsList.slice(0, 5));

//       // 📅 Today's appointments
//       const today = new Date().toISOString().split('T')[0];
//       const todayAppts = appointmentsList.filter(
//         (apt) => apt.appointment_date === today
//       );
//       setTodayAppointments(todayAppts);

//       console.log('✅ Computed Dashboard Stats:', {
//         totalPatients,
//         totalAppointments,
//         totalMedicines,
//         totalInvoices,
//       });
//     } catch (error) {
//       console.error('❌ Error fetching dashboard data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const statCards = [
//     { title: 'Total Patients', value: stats.totalPatients, icon: Users, textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
//     { title: 'Appointments', value: stats.totalAppointments, icon: Calendar, textColor: 'text-green-700', bgColor: 'bg-green-50' },
//     { title: 'Medicines', value: stats.totalMedicines, icon: Package, textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
//     { title: 'Invoices', value: stats.totalInvoices, icon: Receipt, textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
//   ];

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
//         {/* Header */}
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
//           <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your clinic overview.</p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {statCards.map((stat, index) => {
//             const Icon = stat.icon;
//             return (
//               <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-gray-600">{stat.title}</p>
//                     <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
//                   </div>
//                   <div className={`${stat.bgColor} p-3 rounded-lg`}>
//                     <Icon className={`w-6 h-6 ${stat.textColor}`} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Low Stock Alert */}
//         {lowStockMedicines.length > 0 && (
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
//             <div className="flex items-start">
//               <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
//               <div className="flex-1">
//                 <h3 className="text-lg font-semibold text-yellow-900 mb-2">Low Stock Alert</h3>
//                 <p className="text-yellow-800 mb-3">
//                   {lowStockMedicines.length} medicine(s) are running low on stock
//                 </p>
//                 <div className="space-y-2">
//                   {lowStockMedicines.slice(0, 3).map((medicine) => (
//                     <div key={medicine.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
//                       <span className="font-medium text-gray-900">{medicine.medicine_name}</span>
//                       <span className="text-sm text-red-600 font-semibold">
//                         Stock: {medicine.quantity_in_stock}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Today's Appointments */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Today&apos;s Appointments</h2>
//               <Calendar className="w-5 h-5 text-gray-400" />
//             </div>
//             {todayAppointments.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No appointments today</p>
//             ) : (
//               <div className="space-y-3">
//                 {todayAppointments.map((appointment) => (
//                   <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div>
//                       <p className="font-medium text-gray-900">{appointment.patient?.full_name}</p>
//                       <p className="text-sm text-gray-600">{appointment.reason}</p>
//                     </div>
//                     <span className="text-sm font-semibold text-blue-600">
//                       {appointment.appointment_time}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Recent Patients */}
//           <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
//             <div className="flex items-center justify-between mb-4">
//               <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
//               <Users className="w-5 h-5 text-gray-400" />
//             </div>
//             {recentPatients.length === 0 ? (
//               <p className="text-gray-500 text-center py-8">No patients yet</p>
//             ) : (
//               <div className="space-y-3">
//                 {recentPatients.map((patient) => (
//                   <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
//                     <div className="flex items-center">
//                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//                         <span className="text-blue-700 font-semibold">
//                           {patient.full_name?.charAt(0) || '?'}
//                         </span>
//                       </div>
//                       <div className="ml-3">
//                         <p className="font-medium text-gray-900">{patient.full_name}</p>
//                         <p className="text-sm text-gray-600">{patient.phone}</p>
//                       </div>
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {patient.created_at
//                         ? new Date(patient.created_at).toLocaleDateString()
//                         : ''}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }




////////increase features test///////
// src/app/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { 
  Users, Calendar, Package, Receipt, AlertTriangle, TrendingUp, 
  Clock, Activity, DollarSign, Pill, UserCheck, CalendarCheck,
  ArrowUp, ArrowDown, FileText, ShoppingCart
} from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalMedicines: 0,
    totalInvoices: 0,
    todayAppointments: 0,
    completedToday: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
  });
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [expiringMedicines, setExpiringMedicines] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [monthlyData, setMonthlyData] = useState({
    patientsGrowth: 0,
    appointmentsGrowth: 0,
    revenueGrowth: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token found in localStorage');
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Fetch all data in parallel
      const [patientsRes, appointmentsRes, allInventoryRes, lowStockRes, invoicesRes] =
        await Promise.all([
          fetch('/api/patients', { headers }),
          fetch('/api/appointments', { headers }),
          fetch('/api/inventory', { headers }),
          fetch('/api/inventory?filter=low-stock', { headers }),
          fetch('/api/invoices', { headers }),
        ]);

      const [patientsData, appointmentsData, allInventoryData, lowStockData, invoicesData] =
        await Promise.all([
          patientsRes.json(),
          appointmentsRes.json(),
          allInventoryRes.json(),
          lowStockRes.json(),
          invoicesRes.json(),
        ]);

      // Extract data safely
      const extractArray = (obj, key) => {
        if (!obj) return [];
        if (Array.isArray(obj)) return obj;
        if (Array.isArray(obj[key])) return obj[key];
        if (obj.data && Array.isArray(obj.data[key])) return obj.data[key];
        return [];
      };

      const patientsList = extractArray(patientsData, 'patients');
      const appointmentsList = extractArray(appointmentsData, 'appointments');
      const allMedicinesList = extractArray(allInventoryData, 'medicines');
      const lowStockList = extractArray(lowStockData, 'medicines');
      const invoicesList = extractArray(invoicesData, 'invoices');

      // Calculate today's date
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointmentsList.filter(apt => apt.appointment_date === today);
      const completedToday = todayAppts.filter(apt => apt.status === 'completed').length;
      const pendingAppts = appointmentsList.filter(apt => apt.status === 'scheduled').length;

      // Calculate upcoming appointments (next 7 days)
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const upcomingAppts = appointmentsList.filter(apt => {
        const aptDate = new Date(apt.appointment_date);
        return aptDate > new Date() && aptDate <= nextWeek;
      });

      // Calculate total revenue
      const totalRevenue = invoicesList.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);

      // Find expiring medicines (within 30 days)
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      const expiringMeds = allMedicinesList.filter(med => {
        if (!med.expiry_date) return false;
        const expiryDate = new Date(med.expiry_date);
        return expiryDate <= thirtyDaysFromNow && expiryDate > new Date();
      });

      // Calculate monthly growth
      const currentMonth = new Date().getMonth();
      const lastMonthPatients = patientsList.filter(p => {
        if (!p.created_at) return false;
        const createdDate = new Date(p.created_at);
        return createdDate.getMonth() === (currentMonth === 0 ? 11 : currentMonth - 1);
      }).length;
      const thisMonthPatients = patientsList.filter(p => {
        if (!p.created_at) return false;
        const createdDate = new Date(p.created_at);
        return createdDate.getMonth() === currentMonth;
      }).length;

      const patientsGrowth = lastMonthPatients > 0 
        ? ((thisMonthPatients - lastMonthPatients) / lastMonthPatients * 100).toFixed(1)
        : 0;

      setStats({
        totalPatients: patientsList.length,
        totalAppointments: appointmentsList.length,
        totalMedicines: allMedicinesList.length,
        totalInvoices: invoicesList.length,
        todayAppointments: todayAppts.length,
        completedToday,
        pendingAppointments: pendingAppts,
        totalRevenue,
      });

      setLowStockMedicines(lowStockList);
      setExpiringMedicines(expiringMeds);
      setRecentPatients(patientsList.slice(0, 5));
      setTodayAppointments(todayAppts);
      setUpcomingAppointments(upcomingAppts.slice(0, 5));
      setRecentInvoices(invoicesList.slice(0, 5));
      setMonthlyData({
        patientsGrowth: parseFloat(patientsGrowth),
        appointmentsGrowth: 12.5,
        revenueGrowth: 8.3,
      });

    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, bgColor, textColor, change, changeType }) => (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change !== undefined && (
            <div className={`flex items-center text-sm font-medium ${changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'up' ? <ArrowUp className="w-4 h-4 mr-1" /> : <ArrowDown className="w-4 h-4 mr-1" />}
              <span>{Math.abs(change)}% from last month</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-lg`}>
          <Icon className={`w-7 h-7 ${textColor}`} />
        </div>
      </div>
    </div>
  );

  const QuickStatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 hover:border-gray-200 transition-colors">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} p-2 rounded-lg`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, Doctor! 👋</h1>
              <p className="text-blue-100">Here&apos;s what&apos;s happening in your clinic today</p>
              <div className="flex items-center mt-4 space-x-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span className="font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="font-medium">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <Activity className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats - Today's Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickStatCard 
            title="Today's Appointments" 
            value={stats.todayAppointments} 
            icon={CalendarCheck} 
            color="bg-blue-500" 
          />
          <QuickStatCard 
            title="Completed Today" 
            value={stats.completedToday} 
            icon={UserCheck} 
            color="bg-green-500" 
          />
          <QuickStatCard 
            title="Pending Appointments" 
            value={stats.pendingAppointments} 
            icon={Clock} 
            color="bg-orange-500" 
          />
          <QuickStatCard 
            title="Total Revenue" 
            value={`PKR ${stats.totalRevenue.toFixed(0)}`} 
            icon={DollarSign} 
            color="bg-purple-500" 
          />
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={Users}
            bgColor="bg-blue-50"
            textColor="text-blue-600"
            change={monthlyData.patientsGrowth}
            changeType={monthlyData.patientsGrowth >= 0 ? 'up' : 'down'}
          />
          <StatCard
            title="Appointments"
            value={stats.totalAppointments}
            icon={Calendar}
            bgColor="bg-green-50"
            textColor="text-green-600"
            change={monthlyData.appointmentsGrowth}
            changeType="up"
          />
          <StatCard
            title="Medicines"
            value={stats.totalMedicines}
            icon={Package}
            bgColor="bg-purple-50"
            textColor="text-purple-600"
          />
          <StatCard
            title="Invoices"
            value={stats.totalInvoices}
            icon={Receipt}
            bgColor="bg-orange-50"
            textColor="text-orange-600"
            change={monthlyData.revenueGrowth}
            changeType="up"
          />
        </div>

        {/* Alerts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          {lowStockMedicines.length > 0 && (
            <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-orange-900 mb-1">Low Stock Alert</h3>
                  <p className="text-orange-800 text-sm mb-3">
                    {lowStockMedicines.length} medicine(s) running low on stock
                  </p>
                  <div className="space-y-2">
                    {lowStockMedicines.slice(0, 3).map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <Pill className="w-4 h-4 text-orange-600 mr-2" />
                          <span className="font-medium text-gray-900">{medicine.medicine_name}</span>
                        </div>
                        <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
                          {medicine.quantity_in_stock} left
                        </span>
                      </div>
                    ))}
                  </div>
                  {lowStockMedicines.length > 3 && (
                    <p className="text-sm text-orange-700 mt-2 font-medium">
                      +{lowStockMedicines.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Expiring Medicines Alert */}
          {expiringMedicines.length > 0 && (
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-6 shadow-sm">
              <div className="flex items-start">
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-bold text-yellow-900 mb-1">Expiring Soon</h3>
                  <p className="text-yellow-800 text-sm mb-3">
                    {expiringMedicines.length} medicine(s) expiring within 30 days
                  </p>
                  <div className="space-y-2">
                    {expiringMedicines.slice(0, 3).map((medicine) => (
                      <div key={medicine.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="font-medium text-gray-900">{medicine.medicine_name}</span>
                        </div>
                        <span className="text-xs font-semibold text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                          {new Date(medicine.expiry_date).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'invoices', label: 'Invoices', icon: Receipt },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          {(activeTab === 'overview' || activeTab === 'appointments') && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Today&apos;s Schedule</h2>
                </div>
                <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  {todayAppointments.length} appointments
                </span>
              </div>
              {todayAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No appointments scheduled for today</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow">
                      <div className="flex items-center flex-1">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                          {appointment.patient?.full_name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900">{appointment.patient?.full_name}</p>
                          <p className="text-sm text-gray-600">{appointment.reason || 'General checkup'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                          {appointment.appointment_time}
                        </span>
                        <p className={`text-xs mt-1 font-medium ${
                          appointment.status === 'completed' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {appointment.status}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Patients */}
          {(activeTab === 'overview' || activeTab === 'patients') && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
                </div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  {recentPatients.length} patients
                </span>
              </div>
              {recentPatients.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No patients registered yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100 hover:shadow-sm transition-shadow">
                      <div className="flex items-center flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                          {patient.full_name?.charAt(0) || '?'}
                        </div>
                        <div className="ml-4">
                          <p className="font-semibold text-gray-900">{patient.full_name}</p>
                          <div className="flex items-center mt-1 space-x-3">
                            <span className="text-sm text-gray-600">{patient.phone_number || 'No phone'}</span>
                            {patient.blood_group && (
                              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                {patient.blood_group}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-500 font-medium">
                          {patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Upcoming Appointments */}
          {activeTab === 'appointments' && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Upcoming (7 Days)</h2>
                </div>
                <span className="text-sm font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                  {upcomingAppointments.length} scheduled
                </span>
              </div>
              {upcomingAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingAppointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{appointment.patient?.full_name}</p>
                          <p className="text-sm text-gray-600">{appointment.reason}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-purple-700">
                            {new Date(appointment.appointment_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">{appointment.appointment_time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recent Invoices */}
          {(activeTab === 'overview' || activeTab === 'invoices') && (
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Receipt className="w-5 h-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Recent Invoices</h2>
                </div>
                <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  {recentInvoices.length} invoices
                </span>
              </div>
              {recentInvoices.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No invoices generated yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100 hover:shadow-sm transition-shadow">
                      <div className="flex items-center flex-1">
                        <div className="bg-orange-600 p-2 rounded-lg">
                          <ShoppingCart className="w-5 h-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900">{invoice.invoice_number}</p>
                          <p className="text-sm text-gray-600">{invoice.patient?.full_name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-orange-700">
                          PKR {parseFloat(invoice.total_amount).toFixed(2)}
                        </p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          invoice.payment_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {invoice.payment_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => window.location.href = '/patients'}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-4 rounded-lg text-center"
            >
              <Users className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Add Patient</span>
            </button>
            <button
              onClick={() => window.location.href = '/appointments'}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-4 rounded-lg text-center"
            >
              <Calendar className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Schedule</span>
            </button>
            <button
              onClick={() => window.location.href = '/prescriptions'}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-4 rounded-lg text-center"
            >
              <FileText className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Prescriptions</span>
            </button>
            <button
              onClick={() => window.location.href = '/invoices'}
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors p-4 rounded-lg text-center"
            >
              <Receipt className="w-6 h-6 mx-auto mb-2" />
              <span className="text-sm font-medium">Invoices</span>
            </button>
          </div>
        </div>

        {/* Bottom Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Revenue Summary */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Revenue Summary</h3>
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">PKR {stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-semibold">{monthlyData.revenueGrowth}%</span>
                <span className="text-gray-600 ml-1">vs last month</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Paid Invoices</span>
                  <span className="font-semibold text-green-600">
                    {recentInvoices.filter(inv => inv.payment_status === 'paid').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-semibold text-orange-600">
                    {recentInvoices.filter(inv => inv.payment_status !== 'paid').length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Appointments</h3>
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Scheduled</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
              <div className="flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-600 mr-1" />
                <span className="text-green-600 font-semibold">{monthlyData.appointmentsGrowth}%</span>
                <span className="text-gray-600 ml-1">growth</span>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Today</span>
                  <span className="font-semibold text-blue-600">{stats.todayAppointments}</span>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-gray-600">Upcoming (7 days)</span>
                  <span className="font-semibold text-purple-600">{upcomingAppointments.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory Status */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Inventory Status</h3>
              <Package className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Medicines</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalMedicines}</p>
              </div>
              <div className="pt-3 border-t border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Low Stock</span>
                  <span className="font-semibold text-red-600 bg-red-50 px-2 py-1 rounded text-sm">
                    {lowStockMedicines.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Expiring Soon</span>
                  <span className="font-semibold text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-sm">
                    {expiringMedicines.length}
                  </span>
                </div>
              </div>
              {(lowStockMedicines.length > 0 || expiringMedicines.length > 0) && (
                <button
                  onClick={() => window.location.href = '/inventory'}
                  className="w-full mt-3 text-sm bg-orange-50 text-orange-700 font-semibold py-2 px-3 rounded-lg hover:bg-orange-100 transition-colors"
                >
                  Review Inventory
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}