import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const AppointmentHistoryTable = ({ appointments = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const totalPages = Math.ceil(appointments.length / ITEMS_PER_PAGE);
  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8 flex flex-col">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Calendar size={18} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Consultation History</h3>
      </div>
      <div className="overflow-x-auto flex-1">
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
            {paginatedAppointments.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500 font-medium">No appointment history.</td></tr>
            ) : (
              paginatedAppointments.map(appt => (
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

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="p-5 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <span className="text-xs font-bold text-gray-400">
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, appointments.length)} of {appointments.length} consults
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-gray-100 text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                  currentPage === page
                    ? 'bg-[#4A7C59] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-gray-100 text-gray-500 hover:bg-white hover:shadow-sm disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:shadow-none transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentHistoryTable;