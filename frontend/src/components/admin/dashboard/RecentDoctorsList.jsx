import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RecentDoctorsList = ({ doctors = [] }) => {

  // BULLETPROOF AVATAR CHECKER: Ensures it's a real Base64 image
  const getAvatarSrc = (doctor) => {
    // If it exists, isn't the word "null", and is long enough to be a real image string
    if (doctor.avatar && doctor.avatar !== 'null' && doctor.avatar.length > 20) {
      return doctor.avatar;
    }
    // Fallback to the green initials bubble
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doc')}&background=FDF9EE&color=3A6447`;
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#EFEBE1] overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-[#EFEBE1] flex items-center justify-between bg-gray-50/30">
        <h2 className="text-lg font-extrabold text-gray-900">Recently Added Doctors</h2>
        <Link to="/admin/doctors" className="text-xs font-bold text-[#4A7C59] hover:text-[#3A6447] flex items-center gap-1 transition-colors">
          View All <ChevronRight size={14} />
        </Link>
      </div>

      {/* List */}
      <div className="p-2 flex-1">
        {doctors.length === 0 ? (
          <div className="p-6 text-center text-gray-500 font-medium text-sm">No recent doctors found.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 rounded-2xl transition-colors group">
                
                <div className="flex items-center gap-4">
                  {/* THE FIXED IMAGE TAG */}
                  <img 
                    src={getAvatarSrc(doctor)} 
                    alt={doctor.name} 
                    className="w-12 h-12 rounded-full border border-[#EFEBE1] shadow-sm object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#4A7C59] transition-colors">
                      {doctor.name}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                      {doctor.specialization || 'General Practitioner'}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                    ${doctor.status === 'Verified' ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'}`}>
                    {doctor.status || 'Pending'}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentDoctorsList;