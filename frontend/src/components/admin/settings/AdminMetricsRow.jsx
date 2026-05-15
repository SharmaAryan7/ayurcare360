import React from 'react';
import { ShieldCheck, Activity, Database } from 'lucide-react';

const AdminMetricsRow = ({ metrics }) => {
  const data = [
    { title: 'System Status', value: 'Healthy', icon: <Database size={20} />, bg: 'bg-green-50', color: 'text-green-600' },
    { title: 'Security Score', value: metrics?.score || '0/100', icon: <ShieldCheck size={20} />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { title: 'Active Sessions', value: metrics?.sessions || 0, icon: <Activity size={20} />, bg: 'bg-purple-50', color: 'text-purple-600' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
      {data.map((item, index) => (
        <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg} ${item.color}`}>
            {item.icon}
          </div>
          <div>
            <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-1">{item.title}</p>
            <h3 className="text-2xl font-black text-gray-900">{item.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};
export default AdminMetricsRow;