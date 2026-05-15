import React from 'react';
import { Users, UserPlus, ShoppingBag, DollarSign } from 'lucide-react';

const DashboardStatCards = ({ stats }) => {
  const data = [
    { title: 'Total Revenue', value: `₹${Number(stats?.totalRevenue || 0).toLocaleString()}`, icon: <DollarSign size={20} />, bg: 'bg-green-50', color: 'text-green-600' },
    { title: 'Total Orders', value: stats?.totalOrders || 0, icon: <ShoppingBag size={20} />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { title: 'Total Patients', value: stats?.totalPatients || 0, icon: <Users size={20} />, bg: 'bg-amber-50', color: 'text-amber-600' },
    { title: 'Total Doctors', value: stats?.totalDoctors || 0, icon: <UserPlus size={20} />, bg: 'bg-purple-50', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {data.map((item, index) => (
        <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 hover:-translate-y-1 transition-transform">
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
export default DashboardStatCards;