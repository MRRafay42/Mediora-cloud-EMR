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

'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/Layout/DashboardLayout';
import { Users, Calendar, Package, Receipt, AlertTriangle } from 'lucide-react';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    totalAppointments: 0,
    totalMedicines: 0,
    totalInvoices: 0,
  });
  const [lowStockMedicines, setLowStockMedicines] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

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

      console.log('📊 Raw API Data:', {
        patientsData,
        appointmentsData,
        allInventoryData,
        lowStockData,
        invoicesData,
      });

      // 🩺 Flexible data extraction (handles all possible API formats)
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

      // ✅ Compute totals safely
      const totalPatients = patientsList.length;
      const totalAppointments = appointmentsList.length;
      const totalMedicines = allMedicinesList.length;
      const totalInvoices = invoicesList.length;

      setStats({
        totalPatients,
        totalAppointments,
        totalMedicines,
        totalInvoices,
      });

      // 🔻 Low stock
      setLowStockMedicines(lowStockList);

      // 🧍‍♂️ Recent patients (last 5)
      setRecentPatients(patientsList.slice(0, 5));

      // 📅 Today's appointments
      const today = new Date().toISOString().split('T')[0];
      const todayAppts = appointmentsList.filter(
        (apt) => apt.appointment_date === today
      );
      setTodayAppointments(todayAppts);

      console.log('✅ Computed Dashboard Stats:', {
        totalPatients,
        totalAppointments,
        totalMedicines,
        totalInvoices,
      });
    } catch (error) {
      console.error('❌ Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { title: 'Total Patients', value: stats.totalPatients, icon: Users, textColor: 'text-blue-700', bgColor: 'bg-blue-50' },
    { title: 'Appointments', value: stats.totalAppointments, icon: Calendar, textColor: 'text-green-700', bgColor: 'bg-green-50' },
    { title: 'Medicines', value: stats.totalMedicines, icon: Package, textColor: 'text-purple-700', bgColor: 'bg-purple-50' },
    { title: 'Invoices', value: stats.totalInvoices, icon: Receipt, textColor: 'text-orange-700', bgColor: 'bg-orange-50' },
  ];

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
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your clinic overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Low Stock Alert */}
        {lowStockMedicines.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start">
              <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-900 mb-2">Low Stock Alert</h3>
                <p className="text-yellow-800 mb-3">
                  {lowStockMedicines.length} medicine(s) are running low on stock
                </p>
                <div className="space-y-2">
                  {lowStockMedicines.slice(0, 3).map((medicine) => (
                    <div key={medicine.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                      <span className="font-medium text-gray-900">{medicine.medicine_name}</span>
                      <span className="text-sm text-red-600 font-semibold">
                        Stock: {medicine.quantity_in_stock}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Today&apos;s Appointments</h2>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            {todayAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No appointments today</p>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{appointment.patient?.full_name}</p>
                      <p className="text-sm text-gray-600">{appointment.reason}</p>
                    </div>
                    <span className="text-sm font-semibold text-blue-600">
                      {appointment.appointment_time}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
              <Users className="w-5 h-5 text-gray-400" />
            </div>
            {recentPatients.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No patients yet</p>
            ) : (
              <div className="space-y-3">
                {recentPatients.map((patient) => (
                  <div key={patient.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-700 font-semibold">
                          {patient.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-gray-900">{patient.full_name}</p>
                        <p className="text-sm text-gray-600">{patient.phone}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {patient.created_at
                        ? new Date(patient.created_at).toLocaleDateString()
                        : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
