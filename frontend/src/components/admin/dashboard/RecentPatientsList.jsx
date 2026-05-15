import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const RecentPatientsList = ({ patients = [] }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-extrabold text-gray-900">Recent Patients</h3>
        <Link to="/admin/patients" className="text-sm font-bold text-[#3A6447] hover:text-[#2C4D36] flex items-center gap-1 transition-colors">
          View All <ChevronRight size={16} />
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Patient Name</th>
              <th className="px-6 py-4 font-extrabold">Registry ID</th>
              <th className="px-6 py-4 font-extrabold">Last Visit</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {patients.length === 0 ? (
              <tr><td colSpan="4" className="p-6 text-center text-gray-500">No recent patients</td></tr>
            ) : (
              patients.map((patient, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-500">{patient.patient_display_id}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">
                    {new Date(patient.last_visit).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${patient.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {patient.status}
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
export default RecentPatientsList;