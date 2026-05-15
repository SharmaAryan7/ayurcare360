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
        <div className="col-span-1 lg:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="py-4 px-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-extrabold text-gray-900">Upcoming Appointments</h3>
                <button
                    onClick={() => navigate('/doctor/appointments')}
                    className="text-sm font-bold text-[#4A7C59] hover:text-[#3a6146] transition-colors"
                >
                    View All Schedule
                </button>
            </div>

            <div className="overflow-x-auto flex-1 py-2">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-xs uppercase tracking-wider text-gray-900 bg-[#FDF9EE]">
                            <th className="px-8 py-5 font-bold">Patient Name</th>
                            <th className="px-8 py-5 font-bold">Time</th>
                            <th className="px-8 py-5 font-bold">Consultation Type</th>
                            <th className="px-8 py-5 font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-transparent">
                        <tr><td colSpan="4" className="h-4"></td></tr>

                        {appointments.map((apt, index) => {
                            const name = apt.patient_name || 'Unknown Patient';
                            const timeStr = apt.appointment_time
                                ? new Date(`1970-01-01T${apt.appointment_time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : 'N/A';
                            const type = apt.consultation_type || 'General';
                            const status = apt.status || 'Scheduled';

                            return (
                                <tr
                                    key={apt.id || index}
                                    onClick={() => navigate(`/doctor/appointments/${apt.id}`)}
                                    className="hover:bg-[#efefe3]/50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-3 py-2 rounded-l-2xl">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm group-hover:bg-white transition-colors border border-transparent group-hover:border-gray-200">
                                                {name.charAt(0)}
                                            </div>
                                            <span className="font-bold text-gray-900 text-xs">{name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-gray-600 font-semibold text-xs">{timeStr}</span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3 text-gray-600">
                                            {type === 'Video' ? <Video size={20} className="text-blue-500" /> : <User size={20} className="text-green-500" />}
                                            <span className="font-semibold text-xs">{type}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 rounded-r-2xl">
                                        <span className={`px-4 py-2 rounded-full text-xs font-bold tracking-wide ${getStatusStyle(status)}`}>
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {appointments.length === 0 && (
                    <div className="p-12 text-center text-gray-500 text-lg">No upcoming appointments found.</div>
                )}
            </div>
        </div>
    );
};

export default UpcomingAppointmentsTable;