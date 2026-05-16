import React from 'react';
import { Video, User } from 'lucide-react';

const PatientSummaryCard = ({ appointment }) => {
    if (!appointment) return null;

    const name = appointment.patient_name || 'Unknown Patient';

    // Format dates cleanly
    const dateStr = appointment.appointment_date
        ? new Date(appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'TBD';

    // THE FIX: Direct ISO parsing, removing the '1970-01-01T' hack
    const timeStr = appointment.appointment_time
        ? new Date(appointment.appointment_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        : 'TBD';

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'completed': return 'bg-gray-100 text-gray-700';
            case 'scheduled':
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-8 relative min-h-[16rem]">

            {/* Left: Patient Avatar */}
            <div className="w-36 h-36 rounded-full bg-[#FDF9EE] flex-shrink-0 overflow-hidden border-4 border-gray-50 shadow-sm self-center md:self-start">
                <img
                    src={`https://ui-avatars.com/api/?name=${name}&background=E5E7EB&color=4A7C59`}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Right: Details Grid */}
            <div className="flex-1 w-full flex flex-col justify-center py-2">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start mb-4 md:mb-2 gap-4 sm:gap-0 text-center sm:text-left">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{name}</h2>
                        <p className="text-gray-500 font-bold text-xs tracking-wide">ID: {appointment.patient_id}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase inline-block ${getStatusStyle(appointment.status)}`}>
                        {appointment.status}
                    </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-4 py-4 border-t border-gray-100 mt-2 text-center sm:text-left">
                    <div>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-2">Age / Gender</p>
                        <p className="text-gray-900 font-extrabold text-xs">
                            {appointment.age || 'N/A'} / {appointment.gender || 'N/A'}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-2">Appointment Date</p>
                        <p className="text-gray-900 font-extrabold text-xs">{dateStr}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-2">Time</p>
                        <p className="text-gray-900 font-extrabold text-xs">{timeStr}</p>
                    </div>
                </div>

                <div className="text-center sm:text-left mt-2 md:mt-0">
                    <p className="text-xs text-gray-400 font-bold tracking-widest uppercase mb-2 pt-4 border-t border-gray-100 md:border-none md:pt-0">Consultation Type</p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-900 font-extrabold text-xs">
                        {appointment.consultation_type === 'Video' ? <Video size={14} className="text-[#4A7C59]" /> : <User size={14} className="text-[#4A7C59]" />}
                        {appointment.consultation_type || 'General'}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientSummaryCard;