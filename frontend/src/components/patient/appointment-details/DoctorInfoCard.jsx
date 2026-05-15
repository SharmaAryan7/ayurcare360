import React from 'react';
import { Award, Globe, Star, GraduationCap } from 'lucide-react';

const DoctorInfoCard = ({ info, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-full">
        <div className="h-6 bg-gray-200 rounded w-32 mb-6"></div>
        <div className="space-y-4">
          <div className="h-12 bg-gray-100 rounded-xl"></div>
          <div className="h-12 bg-gray-100 rounded-xl"></div>
          <div className="h-12 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const safeInfo = info || {};

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Practitioner Info</h3>

      <div className="space-y-4">
        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="bg-white p-2 rounded-lg text-[#8B6A47] shadow-sm"><Award size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Experience</p>
            <p className="font-bold text-gray-900 text-sm">{safeInfo.experience_years ? `${safeInfo.experience_years} Years` : 'Verified Professional'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="bg-white p-2 rounded-lg text-[#4A7C59] shadow-sm"><GraduationCap size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Qualifications</p>
            <p className="font-bold text-gray-900 text-sm">{safeInfo.qualifications || 'BAMS'}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
          <div className="bg-white p-2 rounded-lg text-amber-500 shadow-sm"><Globe size={18} /></div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Languages</p>
            <p className="font-bold text-gray-900 text-sm">English, Hindi</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfoCard;