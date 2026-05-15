import React from 'react';
import { BriefcaseMedical, Leaf } from 'lucide-react';

const MedicalInfoCard = ({ medical }) => {
  // Helpers to handle strings or arrays from the DB safely
  const parseList = (data) => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    return typeof data === 'string' ? data.split(',').map(i => i.trim()) : [];
  };

  const diseases = parseList(medical.health_history);
  const allergies = parseList(medical.allergies);

  return (
    <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-gray-900">Medical Information</h3>
        <BriefcaseMedical size={18} className="text-[#3A6447]" />
      </div>

      {/* Health History */}
      <div className="mb-6">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Health History</p>
        <div className="flex flex-wrap gap-2">
          {diseases.length > 0 ? diseases.map((disease, idx) => (
            <span key={idx} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-md text-xs font-bold">
              {disease}
            </span>
          )) : <span className="text-xs text-gray-500 font-medium">No history recorded</span>}
        </div>
      </div>

      {/* Allergies */}
      <div className="mb-8">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Allergies</p>
        <div className="flex flex-wrap gap-2">
          {allergies.length > 0 ? allergies.map((allergy, idx) => (
            <span key={idx} className="bg-[#FDF1E8] text-[#D9774B] px-4 py-1.5 rounded-md text-xs font-bold">
              {allergy}
            </span>
          )) : <span className="text-xs text-gray-500 font-medium">No known allergies</span>}
        </div>
      </div>

      {/* Current Medications */}
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Current Medications</p>
        <div className="bg-white rounded-2xl p-4 border border-[#EFEBE1] shadow-sm flex items-start gap-3">
          <Leaf size={16} className="text-[#3A6447] shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-bold text-gray-900">{medical.current_medications || 'None'}</h4>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MedicalInfoCard;