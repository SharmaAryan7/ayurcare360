import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react'; // Removed MoreVertical

const PatientsTable = ({ patients = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Magic Function: Converts any DB ID into 'AYUP-XXXXXX'
  const generateRegistryId = (id) => {
    if (!id) return 'AYUP-000000';
    const uniquePart = String(id).replace(/-/g, '').substring(0, 6).toUpperCase();
    return `AYUP-${uniquePart}`;
  };

  const filteredPatients = patients.filter(patient =>
    (patient.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    // Updated search to filter by the new AYUP- ID format!
    generateRegistryId(patient.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      {/* Top Bar */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#4A7C59]/20 transition-all outline-none"
          />
        </div>
        <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-600 px-5 py-2.5 rounded-2xl text-sm font-bold transition-colors">
          <Filter size={16} /> Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Patient Name</th>
              <th className="px-6 py-4 font-extrabold">Registry ID</th>
              <th className="px-6 py-4 font-extrabold">Age/Gender</th>
              <th className="px-6 py-4 font-extrabold">Contact</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
              <th className="px-6 py-4 font-extrabold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPatients.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No patients found.</td></tr>
            ) : (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#FDF9EE] text-[#4A7C59] flex items-center justify-center font-bold text-sm border border-[#4A7C59]/20">
                        {patient.name?.charAt(0) || 'P'}
                      </div>
                      <span className="font-bold text-gray-900 text-sm">{patient.name}</span>
                    </div>
                  </td>
                  
                  {/* NEW AYUP- ID Format Applied Here! */}
                  <td className="px-6 py-4 text-sm font-bold text-gray-500">
                    {generateRegistryId(patient.id)}
                  </td>
                  
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{patient.age} / {patient.gender}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{patient.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider
                      ${patient.clinical_status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {patient.clinical_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {/* Using your exact link format, no three-dots! */}
                      <Link to={`/admin/patients/${patient.id}`} className="text-[#4A7C59] hover:text-[#3A6447] text-xs font-bold px-3 py-1.5 bg-[#4A7C59]/10 rounded-full transition-colors">
                        View Profile
                      </Link>
                    </div>
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

export default PatientsTable;