import React from 'react';
import { Target, Clock } from 'lucide-react';

const VitalityMetricsRow = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
        <div className="md:col-span-2 bg-gray-100 rounded-[24px] h-48"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-100 rounded-[24px] h-48"></div>
          <div className="bg-gray-100 rounded-[24px] h-48"></div>
        </div>
      </div>
    );
  }

  const score = metrics?.score || 92;
  const goalsCompleted = metrics?.goalsCompleted || 3;
  const goalsTotal = metrics?.goalsTotal || 4;
  const lastChecked = metrics?.lastChecked || "Yesterday,\n04:30 PM";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* Overall Health Score */}
      <div className="md:col-span-2 bg-[#EFECE5] rounded-[24px] p-6 flex flex-col justify-between">
        <div>
          <p className="text-[12px] font-bold text-green-700 uppercase tracking-widest mb-1">Vitality Spark</p>
          <h3 className="text-xl font-extrabold text-gray-900">Overall Health Score: {score}/100</h3>
        </div>

        {/* Decorative Bar Chart representing vitality trend */}
        <div className="flex items-end gap-2 h-16 mt-4">
          {['h-6', 'h-8', 'h-10', 'h-10', 'h-12', 'h-14', 'h-16'].map((height, i) => (
            <div key={i} className={`flex-1 rounded-t-md transition-all duration-700 ${i === 6 ? 'bg-[#3A6447]' : 'bg-[#D1CFC8]'}`} style={{ height: i === 6 ? '100%' : `${(i + 3) * 10}%` }}></div>
          ))}
        </div>
      </div>

      {/* Wellness Goals & Last Checked */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#F4EBD9] rounded-[24px] p-6 flex flex-col justify-center">
          <Target size={20} className="text-[#A67C00] mb-3" />
          <p className="text-[10px] font-bold text-[#A67C00] uppercase tracking-widest mb-1">Wellness Goals</p>
          <h3 className="text-3xl font-extrabold text-gray-900">{goalsCompleted}/{goalsTotal}</h3>
        </div>

        <div className="bg-[#EFECE5] rounded-[24px] p-6 flex flex-col justify-center">
          <Clock size={20} className="text-gray-500 mb-3" />
          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mb-1">Last Checked</p>
          <h3 className="text-sm font-extrabold text-gray-900 leading-tight whitespace-pre-line">{lastChecked}</h3>
        </div>
      </div>

    </div>
  );
};

export default VitalityMetricsRow;