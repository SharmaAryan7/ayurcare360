import React from 'react';
import { DollarSign, ShoppingBag, Users, Stethoscope } from 'lucide-react';

const ReportsMetricsRow = ({ metrics }) => {
  const safeData = metrics || { total_revenue: 0, total_orders: 0, total_patients: 0, total_doctors: 0, total_consultations: 0 };

  const data = [
    { title: 'Total Revenue', value: `₹${Number(safeData.total_revenue).toLocaleString()}`, icon: <DollarSign size={20} />, bg: 'bg-green-50', color: 'text-green-600' },
    { title: 'Total Orders', value: safeData.total_orders, icon: <ShoppingBag size={20} />, bg: 'bg-blue-50', color: 'text-blue-600' },
    { title: 'Total Patients', value: safeData.total_patients, icon: <Users size={20} />, bg: 'bg-amber-50', color: 'text-amber-600' },
    { title: 'Consultations', value: safeData.total_consultations || safeData.total_doctors, icon: <Stethoscope size={20} />, bg: 'bg-purple-50', color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
export default ReportsMetricsRow;