import React from 'react';
import { Video, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpcomingAppointmentsTable = ({ appointments = [] }) => {
    const navigate = useNavigate();

    const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            case 'scheduled':
            default: return 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="col-span-1 lg:col-span-2 bg-white rounded-[24px] md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="py-4 px-4 md:px-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                <h3 className="text-base md:text-lg font-extrabold text-gray-900">Upcoming Appointments</h3>
                <button
                    onClick={() => navigate('/doctor/appointments')}
                    className="text-xs md:text-sm font-bold text-[#4A7C59] hover:text-[#3a6146] transition-colors whitespace-nowrap ml-2"
                >
                    View All
                </button>
            </div>

            <div className="overflow-x-auto custom-scrollbar flex-1">
                <div className="min-w-[600px] py-2">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-[10px] md:text-xs uppercase tracking-wider text-gray-900 bg-[#FDF9EE]">
                                <th className="px-4 md:px-8 py-3 md:py-5 font-bold">Patient Name</th>
                                <th className="px-4 md:px-8 py-3 md:py-5 font-bold">Time</th>
                                <th className="px-4 md:px-8 py-3 md:py-5 font-bold">Consultation Type</th>
                                <th className="px-4 md:px-8 py-3 md:py-5 font-bold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-transparent">
                            <tr><td colSpan="4" className="h-2 md:h-4"></td></tr>

                            {appointments.map((apt, index) => {
                                const name = apt.patient_name || 'Unknown Patient';
                                // THE FIX: Just pass the ISO string directly to new Date()
                                const timeStr = apt.appointment_time
                                    ? new Date(apt.appointment_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                                    : 'N/A';
                                const type = apt.consultation_type || 'General';
                                const status = apt.status || 'Scheduled';

                                return (
                                    <tr
                                        key={apt.id || index}
                                        onClick={() => navigate(`/doctor/appointments/${apt.id}`)}
                                        className="hover:bg-[#efefe3]/50 transition-colors group cursor-pointer"
                                    >
                                        <td className="px-3 md:px-3 py-2 rounded-l-xl md:rounded-l-2xl">
                                            <div className="flex items-center gap-3 md:gap-4">
                                                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-xs md:text-sm group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-200 shrink-0">
                                                    {name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-gray-900 text-xs md:text-sm truncate max-w-[120px] md:max-w-none">{name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-5">
                                            <span className="text-gray-600 font-semibold text-xs md:text-sm whitespace-nowrap">{timeStr}</span>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-5">
                                            <div className="flex items-center gap-2 md:gap-3 text-gray-600">
                                                {type === 'Video' ? <Video size={16} className="text-blue-500 md:w-5 md:h-5" /> : <User size={16} className="text-green-500 md:w-5 md:h-5" />}
                                                <span className="font-semibold text-xs md:text-sm whitespace-nowrap">{type}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 md:px-8 py-4 md:py-5 rounded-r-xl md:rounded-r-2xl">
                                            <span className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full text-[10px] md:text-xs font-bold tracking-wide whitespace-nowrap ${getStatusStyle(status)}`}>
                                                {status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    {appointments.length === 0 && (
                        <div className="p-8 md:p-12 text-center text-gray-500 text-sm md:text-lg">No upcoming appointments found.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UpcomingAppointmentsTable;