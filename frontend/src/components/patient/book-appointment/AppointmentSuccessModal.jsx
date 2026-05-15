import React from 'react';
import { Check, Calendar, Clock, User } from 'lucide-react';

const AppointmentSuccessModal = ({ isOpen, appointmentDetails, onViewAppointment, onGoToDashboard }) => {
  if (!isOpen) return null;

  // FIX: Safely parse the image URL just like we did on the Dashboard
  const avatarUrl = appointmentDetails?.avatar ? (appointmentDetails.avatar.startsWith('http') ? appointmentDetails.avatar : `http://localhost:5000${appointmentDetails.avatar}`) : null;

  // FIX: Smartly grab the first initial, ignoring "Dr. "
  const getInitial = (name) => {
    if (!name) return <User size={20} />;
    return name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-[#FDF9EE] w-full max-w-[420px] rounded-[32px] shadow-2xl p-8 md:p-10 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-200">

        {/* Success Checkmark */}
        <div className="w-16 h-16 rounded-full bg-[#EAE5D9] flex items-center justify-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#4A7C59] flex items-center justify-center shadow-sm">
            <Check size={20} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Headings */}
        <h2 className="text-xl font-extrabold text-amber-900 mb-2">
          Appointment Booked Successfully
        </h2>
        <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 px-4">
          Your video consultation has been scheduled successfully.
        </p>

        {/* Appointment Details Card */}
        <div className="bg-white rounded-[24px] p-6 w-full shadow-sm border border-[#EFEBE1] mb-8 text-left">

          {/* Doctor Info */}
          <div className="flex items-center gap-4 mb-6">

            {/* FIX: Render the Avatar or the exact Initial */}
            {avatarUrl ? (
              <img src={avatarUrl} alt="Doctor" className="w-12 h-12 rounded-xl object-cover border border-[#EFEBE1] shrink-0" />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-[#EAE5D9] text-[#4A7C59] flex items-center justify-center text-xl font-bold shrink-0 border border-[#EFEBE1]">
                {getInitial(appointmentDetails?.doctorName)}
              </div>
            )}

            <div>
              <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Primary Consultant</p>
              <h3 className="text-sm font-bold text-gray-900">{appointmentDetails?.doctorName || 'Practitioner'}</h3>
            </div>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4 pt-5 border-t border-[#EFEBE1]">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Date</p>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Calendar size={14} className="text-[#4A7C59]" />
                {appointmentDetails?.date || '--'}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Time</p>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                <Clock size={14} className="text-[#4A7C59]" />
                {appointmentDetails?.time || '--'}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={onViewAppointment}
            className="w-full bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-3.5 rounded-full transition-colors text-sm shadow-sm"
          >
            View Appointment
          </button>

          <button
            onClick={onGoToDashboard}
            className="w-full bg-[#EAE5D9] hover:bg-[#D1CFC8] text-gray-700 font-bold py-3.5 rounded-full transition-colors text-sm"
          >
            Go to Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};

export default AppointmentSuccessModal;