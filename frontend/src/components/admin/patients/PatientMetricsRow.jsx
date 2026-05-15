import React from 'react';
import { Users, UserPlus, FileWarning, Activity } from 'lucide-react';

const PatientMetricsRow = ({ metrics, total }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

      {/* Total Patients */}
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-5 border-l-4 border-l-blue-600">
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
          <Users size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Patients</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{total || 0}</h3>
        </div>
      </div>

      {/* New This Week */}
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-5 border-l-4 border-l-[#3A6447]">
        <div className="w-12 h-12 rounded-full bg-[#E7F3EB] flex items-center justify-center text-[#3A6447] shrink-0">
          <UserPlus size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">New This Week</p>
          <h3 className="text-2xl font-extrabold text-gray-900">+{metrics?.newThisWeek || 0}</h3>
        </div>
      </div>

      {/* Pending Reviews */}
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-5 border-l-4 border-l-[#D9774B]">
        <div className="w-12 h-12 rounded-full bg-[#FDF1E8] flex items-center justify-center text-[#D9774B] shrink-0">
          <FileWarning size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Reviews</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{metrics?.pendingReviews || 0}</h3>
        </div>
      </div>

      {/* Avg. Age */}
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-5 border-l-4 border-l-[#9333EA]">
        <div className="w-12 h-12 rounded-full bg-[#F3E8FF] flex items-center justify-center text-[#9333EA] shrink-0">
          <Activity size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Avg. Age</p>
          <h3 className="text-2xl font-extrabold text-gray-900">{metrics?.averageAge || 0} Yrs</h3>
        </div>
      </div>

    </div>
  );
};

export default PatientMetricsRow;