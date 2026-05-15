import React from 'react';
import { Calendar, Clock, Video, MapPin, User } from 'lucide-react';

const AppointmentSummaryCard = ({ practitioner, actions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-full flex flex-col justify-center">
        <div className="flex gap-6 items-center mb-6">
          <div className="w-20 h-20 bg-gray-200 rounded-[24px]"></div>
          <div className="space-y-3 flex-1">
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="h-12 bg-gray-100 rounded-xl"></div>
          <div className="h-12 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const safePrac = practitioner || {};
  const safeAct = actions || {};
  const isVideo = safeAct.mode?.toLowerCase() === 'video';
  const docName = safePrac.doctor_name || 'Practitioner';

  // Parse the exact timestamp from the database
  const aptDate = new Date(safeAct.start_time);

  // Image Logic (Ready to catch it if you ever add it to the backend)
  const rawAvatar = safePrac.avatar;
  let avatarUrl = null;
  if (rawAvatar) {
    if (rawAvatar.startsWith('http') || rawAvatar.startsWith('data:image')) {
      avatarUrl = rawAvatar;
    } else {
      const cleanPath = rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}`;
      avatarUrl = `http://localhost:5000${cleanPath}`;
    }
  }

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDF9EE] rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">

          {avatarUrl ? (
            <img src={avatarUrl} alt="Doctor" className="w-20 h-20 rounded-[24px] object-cover shadow-inner" />
          ) : (
            <div className="w-20 h-20 bg-[#EFEBE1] rounded-[24px] flex items-center justify-center text-[#8B6A47] font-bold text-3xl shadow-inner">
              {docName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase()}
            </div>
          )}

          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{docName}</h2>
            <p className="text-[#4A7C59] font-bold text-sm bg-[#E7F3EB] px-3 py-1 rounded-full inline-block">
              {safePrac.specialization || 'Ayurvedic Specialist'}
            </p>
          </div>
        </div>

        <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest border ${safeAct.status === 'Completed' ? 'bg-[#F3E8FF] text-[#9333EA] border-[#e9d5ff]' :
          safeAct.status === 'Cancelled' ? 'bg-[#FEE2E2] text-[#EF4444] border-[#fecaca]' :
            'bg-[#E7F3EB] text-[#4A7C59] border-[#cce8d6]'
          }`}>
          {safeAct.status || 'Scheduled'}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#EFEBE1] flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm text-[#8B6A47]">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Scheduled Date</p>
            <p className="font-bold text-gray-900 text-base">{!isNaN(aptDate.getTime()) ? aptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '--'}</p>
          </div>
        </div>

        <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#EFEBE1] flex items-center gap-4">
          <div className="bg-white p-3 rounded-xl shadow-sm text-[#8B6A47]">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Time & Mode</p>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900 text-base">{!isNaN(aptDate.getTime()) ? aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--'}</p>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="flex items-center gap-1 text-xs font-semibold text-gray-500">
                {isVideo ? <><Video size={14} /> Video</> : <><MapPin size={14} /> Clinic</>}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentSummaryCard;