import React from 'react';
import { Droplets, MapPin, Ruler } from 'lucide-react';

const PatientProfileSummary = ({ profile, location, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-full flex flex-col justify-center">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="h-10 bg-gray-100 rounded-xl"></div>
          <div className="h-10 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const safeProfile = profile || {};
  const displayName = safeProfile.full_name || 'Patient User';

  const getInitials = (name) => {
    if (!name) return 'PU';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDF9EE] rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 bg-[#E7F3EB] rounded-full flex items-center justify-center text-[#4A7C59] border-4 border-white shadow-sm overflow-hidden">
              {/* Show permanently saved image from DB, else show initials */}
              {safeProfile.avatar ? (
                <img src={safeProfile.avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold">{getInitials(displayName)}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#EBCB8B] rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{displayName}</h2>
            <p className="text-[#A67C00] font-bold text-sm bg-[#FEF5D3] px-3 py-1 rounded-full inline-block">
              {safeProfile.prakriti_type || 'Prakriti Assessment Pending'}
            </p>
          </div>
        </div>
        <span className="text-[10px] font-extrabold text-green-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          {safeProfile.clinical_status || 'Active Care'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#EFEBE1]">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Age / Gender</p>
          <p className="font-bold text-gray-900">{safeProfile.age || '--'} Yrs / {safeProfile.gender || '--'}</p>
        </div>
        <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#EFEBE1]">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Droplets size={12} /> Blood Group</p>
          <p className="font-bold text-gray-900">{safeProfile.blood_group || '--'}</p>
        </div>
        <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#EFEBE1]">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><Ruler size={12} /> Height</p>
          <p className="font-bold text-gray-900 truncate">{safeProfile.height_cm ? `${safeProfile.height_cm} cm` : '--'}</p>
        </div>
        <div className="bg-[#FDFBF7] p-4 rounded-2xl border border-[#EFEBE1]">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1 flex items-center gap-1"><MapPin size={12} /> Location</p>
          <p className="font-bold text-gray-900 truncate">{location || '--'}</p>
        </div>
      </div>
    </div>
  );
};

export default PatientProfileSummary;