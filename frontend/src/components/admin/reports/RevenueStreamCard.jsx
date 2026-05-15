import React from 'react';
import { PieChart } from 'lucide-react';

const RevenueStreamCard = ({ stream = [] }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><PieChart size={18} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Revenue Stream Analysis</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {stream.length === 0 ? (
          <p className="text-gray-500">No revenue data available.</p>
        ) : (
          stream.map((s, index) => (
            <div key={index} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-700">{s.stream}</span>
              <span className="text-xl font-black text-[#3A6447]">₹{Number(s.value).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default RevenueStreamCard;