import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Loader2, User } from 'lucide-react';

const AppointmentsTable = ({ appointments, loading, activeTab, currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming': case 'scheduled':
        return <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full flex items-center gap-1.5 w-max"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Upcoming</span>;
      case 'completed':
        return <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full flex items-center gap-1.5 w-max"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Completed</span>;
      case 'cancelled':
        return <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full flex items-center gap-1.5 w-max"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Cancelled</span>;
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full flex items-center gap-1.5 w-max"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span>{status || 'Unknown'}</span>;
    }
  };

  if (loading) return (
      <div className="bg-white rounded-2xl shadow-sm border border-[#EFEBE1] flex justify-center items-center py-20 mb-8">
        <Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin" />
      </div>
  );

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#EFEBE1] overflow-hidden mb-8">
      {/* WRAPPER TO PREVENT MOBILE CRUSHING */}
      <div className="overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-12 gap-4 px-8 py-5 border-b border-[#EFEBE1] bg-[#FAFAF8] text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-4">Doctor</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Action</div>
          </div>

          {(!appointments || appointments.length === 0) ? (
            <div className="text-center py-20 text-gray-500 font-medium text-lg">No appointments found in this category.</div>
          ) : (
            <div className="divide-y divide-[#EFEBE1]">
              {appointments.map((apt) => {
                const aptDate = new Date(apt.scheduled_at || apt.start_time);
                const docName = apt.doctorName || apt.doctor_name || 'Dr. Unknown';
                
                // THE SUPER FIX: Handling Base64, web links, and local uploads perfectly!
                const rawAvatar = apt.avatar || apt.profile_image_url || apt.profile_picture;
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
                  <div key={apt.id || apt._id} className="grid grid-cols-12 gap-4 px-8 py-6 items-center hover:bg-[#FAFAF8] transition-colors">
                    
                    <div className="col-span-4 flex items-center gap-4">
                      {/* THE FIX: Render the Doctor's Image with an onError fallback */}
                      {avatarUrl ? (
                        <img 
                            src={avatarUrl} 
                            alt="Doctor" 
                            className="w-12 h-12 rounded-full object-cover border border-[#EFEBE1] shrink-0 shadow-sm"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=EAE5D9&color=4A7C59`;
                            }}
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#EAE5D9] flex items-center justify-center text-[#4A7C59] font-bold border border-[#EFEBE1] shrink-0">
                           {docName.replace(/^Dr\.\s*/i, '').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-base font-bold text-gray-900 truncate max-w-[150px] lg:max-w-none">{docName}</p>
                        <p className="text-sm text-gray-500 font-medium truncate max-w-[150px] lg:max-w-none">{apt.specialty || apt.specialization || 'General'}</p>
                      </div>
                    </div>

                    <div className="col-span-2 text-sm font-semibold text-gray-700">
                      {!isNaN(aptDate.getTime()) ? aptDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '--'}
                    </div>
                    <div className="col-span-2 text-sm font-semibold text-gray-700">
                      {!isNaN(aptDate.getTime()) ? aptDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '--'}
                    </div>
                    <div className="col-span-2">{getStatusBadge(apt.status)}</div>

                    <div className="col-span-2 text-right">
                      {apt.status?.toLowerCase() === 'cancelled' ? (
                        <button onClick={() => navigate('/patient/book-appointment')} className="px-6 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm whitespace-nowrap">
                          Rebook
                        </button>
                      ) : (
                        <button onClick={() => navigate(`/patient/appointments/${apt.id || apt._id}`)} className="px-6 py-2 text-sm font-bold text-white bg-[#4A7C59] rounded-full hover:bg-[#3d6649] transition-colors shadow-sm whitespace-nowrap">
                          {apt.status?.toLowerCase() === 'completed' ? 'View Summary' : 'View Details'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="px-4 md:px-8 py-5 border-t border-[#EFEBE1] flex flex-col sm:flex-row justify-between items-center bg-[#FAFAF8] gap-4 sm:gap-0">
          <span className="text-sm font-semibold text-gray-500">Showing {startItem}-{endItem} of {totalItems}</span>
          <div className="flex gap-2">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronLeft size={20} /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => onPageChange(page)} className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-colors shadow-sm ${currentPage === page ? 'bg-[#4A7C59] text-white' : 'text-gray-600 hover:bg-gray-200 bg-transparent'}`}>{page}</button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="w-9 h-9 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRight size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsTable;