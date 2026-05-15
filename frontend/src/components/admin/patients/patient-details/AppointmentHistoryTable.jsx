import React from 'react';
import { Calendar } from 'lucide-react';

const AppointmentHistoryTable = ({ appointments = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={18} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Consultation History</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Date & Time</th>
              <th className="px-6 py-4 font-extrabold">Doctor</th>
              <th className="px-6 py-4 font-extrabold">Specialization</th>
              <th className="px-6 py-4 font-extrabold">Type</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No appointment history.</td></tr>
            ) : (
              appointments.map(appt => (
                <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">
                    {new Date(appt.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#4A7C59]">{appt.doctor_name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{appt.specialization}</td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-700">{appt.type}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                      ${appt.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                        appt.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                      {appt.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AppointmentHistoryTable;