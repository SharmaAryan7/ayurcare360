import React, { useState, useEffect } from 'react';
import { Calendar, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import DashboardStatCards from '../../components/admin/dashboard/DashboardStatCards';
import RecentDoctorsList from '../../components/admin/dashboard/RecentDoctorsList';
import RecentPatientsList from '../../components/admin/dashboard/RecentPatientsList';
import RecentOrdersTable from '../../components/admin/dashboard/RecentOrdersTable';

// Magic Function 1: Formats the custom AYUP- ID
const generateRegistryId = (id) => {
  if (!id) return 'AYUP-000000';
  const uniquePart = String(id).replace(/-/g, '').substring(0, 6).toUpperCase();
  return `AYUP-${uniquePart}`;
};

// Magic Function 2: Formats the backend timestamp into a clean Date
const formatLastVisit = (dateString) => {
  if (!dateString) return 'New Patient';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
};

const AdminDashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalDoctors: 0, totalPatients: 0, totalOrders: 0, totalRevenue: 0 },
    recentDoctors: [],
    recentPatients: [],
    recentOrders: []
  });

  // Get dynamic current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats concurrently
        const [docRes, patRes, ordRes, revRes] = await Promise.all([
          adminApi.getTotalDoctors(),
          adminApi.getTotalPatients(),
          adminApi.getTotalOrders(),
          adminApi.getTotalRevenue()
        ]);

        // Fetch recent lists
        const [recentDocs, recentPats, recentOrds] = await Promise.all([
          adminApi.getRecentDoctors(),
          adminApi.getRecentPatients(),
          adminApi.getRecentOrders()
        ]);

        // SAFELY EXTRACT ARRAYS (Handles both array returns and object wraps)
        const rawDocs = Array.isArray(recentDocs) ? recentDocs : (recentDocs?.doctors || recentDocs?.data || []);
        const rawPats = Array.isArray(recentPats) ? recentPats : (recentPats?.patients || recentPats?.data || []);
        const rawOrds = Array.isArray(recentOrds) ? recentOrds : (recentOrds?.orders || recentOrds?.data || []);

        // --- DATA INTERCEPTION & FORMATTING ---
        
        // 1. Format Doctors (Injects avatar fallback)
        const processedDoctors = rawDocs.map(doctor => ({
          ...doctor,
          avatar: doctor.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doc')}&background=FDF9EE&color=3A6447`
        }));

        // 2. Format Patients (Injects AYUP ID and formats Date)
        const processedPatients = rawPats.map(patient => ({
          ...patient,
          patient_display_id: generateRegistryId(patient.id || patient.user_id),
          last_visit: formatLastVisit(patient.last_visit || patient.updated_at)
        }));

        setData({
          stats: {
            // Safe extraction for metrics
            totalDoctors: typeof docRes === 'number' ? docRes : (docRes?.count || docRes?.data || 0),
            totalPatients: typeof patRes === 'number' ? patRes : (patRes?.count || patRes?.data || 0),
            totalOrders: typeof ordRes === 'number' ? ordRes : (ordRes?.count || ordRes?.data || 0),
            totalRevenue: typeof revRes === 'number' ? revRes : (revRes?.revenue || revRes?.total || revRes?.data || 0)
          },
          recentDoctors: processedDoctors, // Handing the clean data to the table
          recentPatients: processedPatients, // Handing the clean data to the table
          recentOrders: rawOrds
        });
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300">

      {/* Header aligned parallel with Date */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Clinic Overview</p>
          <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none">Dashboard</h1>
        </div>

        {/* Dynamic Date */}
        <div className="flex items-center gap-2 text-gray-500 bg-white px-4 py-2.5 rounded-full border border-[#EFEBE1] shadow-sm w-fit h-fit mb-1">
          <Calendar size={16} />
          <span className="text-xs font-bold tracking-wide">Today: {currentDate}</span>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <DashboardStatCards stats={data.stats} />

      {/* Middle Row (Doctors & Patients) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <RecentDoctorsList doctors={data.recentDoctors} />
        <RecentPatientsList patients={data.recentPatients} />
      </div>

      {/* Bottom Table */}
      <RecentOrdersTable orders={data.recentOrders} />

    </div>
  );
};

export default AdminDashboardPage;