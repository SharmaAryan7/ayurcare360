import React from 'react';
import { Calendar, Clock, Video, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingAppointmentCard = ({ appointment, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-[#4A7C59] rounded-[24px] md:rounded-[32px] p-6 md:p-8 h-full flex flex-col shadow-sm animate-pulse min-h-[240px]">
        <div className="h-4 bg-white/20 rounded w-1/3 mb-6"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-white/20 rounded-full shrink-0"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-3 bg-white/20 rounded w-1/2"></div>
          </div>
        </div>
        <div className="space-y-3 mt-auto">
          <div className="h-3 bg-white/20 rounded w-full"></div>
          <div className="h-3 bg-white/20 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-[#4A7C59] rounded-[24px] md:rounded-[32px] p-6 md:p-8 h-full flex flex-col shadow-sm text-white relative overflow-hidden min-h-[240px]">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] pointer-events-none"></div>
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-2 relative z-10">Next Consultation</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-center mt-4 relative z-10">
          <Calendar size={32} className="text-white/40 mb-3" />
          <p className="text-base font-bold mb-1">No Upcoming Sessions</p>
          <p className="text-xs text-white/70 mb-6 max-w-[200px]">You don't have any future appointments scheduled.</p>
          <button 
            onClick={() => navigate('/patient/book-appointment')}
            className="bg-white text-[#4A7C59] px-6 py-2.5 rounded-full text-xs font-bold shadow-sm hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Book Appointment
          </button>
        </div>
      </div>
    );
  }

  // THE FIX: Parse the ISO timestamp directly safely!
  const appointmentDate = new Date(appointment.scheduled_at);
  const dateStr = appointmentDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = appointmentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-[#4A7C59] rounded-[24px] md:rounded-[32px] p-6 md:p-8 h-full flex flex-col shadow-sm text-white relative overflow-hidden min-h-[240px] transition-transform hover:-translate-y-1 duration-300">
      <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-full pointer-events-none"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <h3 className="text-[10px] md:text-xs font-extrabold uppercase tracking-widest text-white/70">Next Consultation</h3>
        <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold tracking-wider backdrop-blur-sm">
          {appointment.mode === 'Video' ? 'Online' : 'In-Person'}
        </span>
      </div>

      <div className="flex items-center gap-4 mb-6 relative z-10">
        <img 
          src={appointment.avatar || `https://ui-avatars.com/api/?name=${appointment.doctorName}&background=E5E7EB&color=4A7C59`} 
          alt={appointment.doctorName} 
          className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-white/20 object-cover shadow-sm shrink-0 bg-white"
        />
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-xl font-extrabold truncate pr-2">{appointment.doctorName}</h2>
          <p className="text-white/80 text-[10px] md:text-xs font-bold uppercase tracking-wider truncate pr-2">
            {appointment.specialty || 'General Practitioner'}
          </p>
        </div>
      </div>

      <div className="bg-white/10 rounded-2xl p-4 mt-auto backdrop-blur-sm border border-white/10 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-bold">
            <Calendar size={16} className="text-white/70" />
            <span>{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-bold text-[#E8C8A0]">
            <Clock size={16} />
            <span>{timeStr}</span>
          </div>
        </div>

        <button 
          onClick={() => navigate('/patient/appointments')}
          className="w-full bg-[#E8C8A0] hover:bg-[#d5b58e] text-[#4A7C59] py-2.5 rounded-xl text-xs md:text-sm font-extrabold transition-colors shadow-sm mt-1 flex items-center justify-center gap-2"
        >
          {appointment.mode === 'Video' ? <Video size={16} /> : <User size={16} />}
          View Details
        </button>
      </div>
    </div>
  );
};

export default UpcomingAppointmentCard;