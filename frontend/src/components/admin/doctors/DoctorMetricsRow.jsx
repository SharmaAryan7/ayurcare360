import React from 'react';
import { Users, Clock, ShieldCheck, Activity } from 'lucide-react';

const DoctorMetricsRow = ({ metrics }) => {
  const data = [
    { title: 'Total Doctors', value: metrics?.total || 0, icon: <Users size={18} className="sm:w-5 sm:h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Pending Approval', value: metrics?.pending || 0, icon: <Clock size={18} className="sm:w-5 sm:h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Verification Rate', value: metrics?.verificationRate || '0%', icon: <ShieldCheck size={18} className="sm:w-5 sm:h-5" />, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Avg Response Time', value: metrics?.avgResponseTime || '0', icon: <Activity size={18} className="sm:w-5 sm:h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    // Responsive grid handling
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
      {data.map((item, index) => (
        <div key={index} className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sm border border-gray-100 flex items-center gap-4 sm:gap-5 hover:-translate-y-1 transition-transform">
          <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
            {item.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] sm:text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 truncate">{item.title}</p>
            <h3 className="text-xl sm:text-2xl font-black text-gray-900 truncate">{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DoctorMetricsRow;