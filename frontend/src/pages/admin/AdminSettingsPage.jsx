import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import AdminMetricsRow from '../../components/admin/settings/AdminMetricsRow';
import AdminsTable from '../../components/admin/settings/AdminsTable';
import { Loader2 } from 'lucide-react';

const AdminSettingsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    metrics: { revenue: 0, score: "0/100", sessions: 0 },
    admins: []
  });

  useEffect(() => {
    const fetchSettingsData = async () => {
      try {
        // THE FIX: Adding .catch() to each call prevents one broken route from crashing the whole page
        const [revRes, scoreRes, sessionRes, adminsRes] = await Promise.all([
          adminApi.getSettingsTotalRevenue().catch(err => { console.error("Revenue error"); return { revenue: 0 }; }),
          adminApi.getSecurityScore().catch(err => { console.error("Score error"); return { score: "0/100" }; }),
          adminApi.getActiveSessions().catch(err => { console.error("Session error"); return { sessions: 0 }; }),
          adminApi.getAllAdmins().catch(err => { console.error("Admins error", err); return { admins: [] }; }) 
        ]);

        setData({
          metrics: {
            revenue: revRes.revenue || 0,
            score: scoreRes.score || "0/100",
            sessions: sessionRes.sessions || 0
          },
          admins: adminsRes.admins || []
        });
      } catch (error) {
        console.error("Critical failure fetching settings data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettingsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300 flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Staff Management
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Manage system administrators, permissions, and security settings.
        </p>
      </div>

      <AdminMetricsRow metrics={data.metrics} />

      <div className="flex-1">
        {/* Pass the fetched admins to the table */}
        <AdminsTable admins={data.admins} />
      </div>
    </div>
  );
};

export default AdminSettingsPage;