import React, { useEffect } from 'react';
import { Calendar, Clock, Video, ArrowRight, MapPin, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingAppointmentCard = ({ appointment, isLoading }) => {
  const navigate = useNavigate();

  // 🔥 THE DEBUGGER: This will print the exact JSON to your browser console!
  useEffect(() => {
    if (!isLoading) {
      console.log("🚨 INCOMING APPOINTMENT DATA:", appointment);
    }
  }, [appointment, isLoading]);

  if (isLoading) {
    return (
      <div className="bg-[#3A6447] rounded-[32px] p-8 h-full shadow-md animate-pulse flex flex-col justify-between min-h-[280px]">
        <div className="h-4 bg-white/20 rounded w-32 mb-6"></div>
        <div className="h-8 bg-white/20 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-white/20 rounded-2xl w-full mb-6"></div>
        <div className="h-12 bg-white/20 rounded-full w-full"></div>
      </div>
    );
  }

  // If no upcoming appointment is returned from the DB
  if (!appointment || (!appointment.id && !appointment._id)) {
    return (
      <div className="bg-[#3A6447] rounded-[32px] p-8 h-full text-white flex flex-col justify-center items-center text-center shadow-md relative overflow-hidden min-h-[280px]">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white opacity-5 rounded-full blur-2xl"></div>
        <Calendar size={48} className="text-white/40 mb-4" />
        <h3 className="text-xl font-bold mb-2">No Upcoming Sessions</h3>
        <p className="text-white/70 text-sm mb-6">Schedule a consultation to maintain your wellness routine.</p>
        <button
          onClick={() => navigate('/patient/book-appointment')}
          className="bg-[#EBCB8B] hover:bg-[#d4b476] text-gray-900 text-sm font-bold py-3 px-6 rounded-full w-full transition-colors"
        >
          Book Appointment
        </button>
      </div>
    );
  }

  const aptDate = new Date(appointment?.scheduled_at || appointment?.start_time);
  
  // THE SUPER FIX: Check for every possible image variable name, just like the Doctor Selection Card!
  // THE SUPER FIX: Handle Base64 strings, external HTTP links, AND local uploads!
  const rawAvatar = appointment?.avatar || appointment?.profile_image_url || appointment?.profile_picture;
  
  let avatarUrl = null;
  if (rawAvatar) {
      // If it's a web link OR a Base64 image string, use it exactly as is!
      if (rawAvatar.startsWith('http') || rawAvatar.startsWith('data:image')) {
          avatarUrl = rawAvatar;
      } else {
          // Otherwise, it's a local folder path, so attach the backend port
          const cleanPath = rawAvatar.startsWith('/') ? rawAvatar : `/${rawAvatar}`;
          avatarUrl = `http://localhost:5000${cleanPath}`;
      }
  }
  
  const docName = appointment?.doctorName || appointment?.doctor_name || 'Practitioner';
  const specialty = appointment?.specialty || appointment?.specialization || 'Consultation';

  // Fallback initial generator
  const getInitial = (name) => {
    if (!name) return <User size={20} />;
    return name.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase();
  };

  return (
    <div className="bg-[#3A6447] rounded-[32px] p-8 h-full text-white flex flex-col justify-between shadow-md relative overflow-hidden group min-h-[280px]">
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl group-hover:opacity-10 transition-opacity duration-700"></div>

      <div>
        <div className="flex justify-between items-center mb-6 relative z-10">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#EBCB8B] flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-[#EBCB8B] rounded-full animate-pulse"></div>
            Next Session
          </span>
          {appointment?.mode === 'Video' || appointment?.type === 'video' ? <Video size={16} className="text-white/70" /> : <MapPin size={16} className="text-white/70" />}
        </div>

        <div className="flex items-center gap-4 mb-6 relative z-10">
            {avatarUrl ? (
                <img 
                    src={avatarUrl} 
                    alt="Doctor" 
                    className="w-14 h-14 rounded-2xl border-2 rounded-full border-white/20 object-cover shrink-0 shadow-sm bg-white" 
                />
            ) : (
                <div className="w-14 h-14 rounded-2xl bg-[#FDF9EE] flex items-center justify-center shrink-0 border-2 border-white/20 text-2xl font-bold text-[#3A6447] shadow-sm">
                    {getInitial(docName)}
                </div>
            )}
            <div>
                <h3 className="text-2xl font-extrabold leading-tight mb-1">{docName}</h3>
                <p className="text-white/70 text-sm font-medium">{specialty}</p>
            </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 flex justify-between items-center border border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Calendar size={18} /></div>
            <div>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Date</p>
              <p className="font-bold text-sm">
                {!isNaN(aptDate.getTime()) ? aptDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
              </p>
            </div>
          </div>
          <div className="w-px h-8 bg-white/20"></div>
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl"><Clock size={18} /></div>
            <div>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-wider">Time</p>
              <p className="font-bold text-sm">
                {!isNaN(aptDate.getTime()) ? aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/patient/appointments/${appointment?.id || appointment?._id}`)}
        className="mt-6 w-full bg-white hover:bg-gray-50 text-[#3A6447] font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-sm relative z-10"
      >
        Join Session <ArrowRight size={16} />
      </button>
    </div>
  );
};

export default UpcomingAppointmentCard;