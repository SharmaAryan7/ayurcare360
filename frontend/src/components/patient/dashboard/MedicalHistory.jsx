import React from 'react';
import { Stethoscope, Syringe, AlertCircle, FileText } from 'lucide-react';

const MedicalHistory = ({ history, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
          <div className="h-32 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  // Safe Fallbacks
  const safeHistory = history || {};
  const pastDiagnoses = safeHistory.pastDiagnoses || [];
  const surgeries = safeHistory.surgeries || [];
  const conditions = safeHistory.chronicConditions || [];
  const note = safeHistory.doctorsNote || "No primary clinical notes recorded.";

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-[#E7F3EB] p-2.5 rounded-xl text-[#4A7C59]">
          <FileText size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Clinical Overview</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Past Diagnoses */}
        <div className="bg-[#FDFBF7] border border-[#EFEBE1] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-[#8B6A47] font-bold text-sm mb-4">
            <Stethoscope size={16} /> Past Diagnoses
          </div>
          {pastDiagnoses.length > 0 ? (
            <ul className="space-y-3">
              {pastDiagnoses.map((item, idx) => (
                <li key={idx} className="flex justify-between items-start border-b border-[#EFEBE1] pb-2 last:border-0 last:pb-0">
                  <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">No past diagnoses recorded.</p>
          )}
        </div>

        {/* Procedures / Surgeries */}
        <div className="bg-[#FDFBF7] border border-[#EFEBE1] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-[#4A7C59] font-bold text-sm mb-4">
            <Syringe size={16} /> Procedures
          </div>
          {surgeries.length > 0 ? (
            <ul className="space-y-3">
              {surgeries.map((item, idx) => (
                <li key={idx} className="flex justify-between items-start border-b border-[#EFEBE1] pb-2 last:border-0 last:pb-0">
                  <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">{item.date}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">No procedures recorded.</p>
          )}
        </div>

        {/* Chronic Conditions */}
        <div className="bg-[#FDFBF7] border border-[#EFEBE1] rounded-2xl p-5">
          <div className="flex items-center gap-2 text-[#D9774B] font-bold text-sm mb-4">
            <AlertCircle size={16} /> Chronic Conditions
          </div>
          {conditions.length > 0 ? (
            <ul className="space-y-3">
              {conditions.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.severe ? 'bg-red-500 animate-pulse' : 'bg-orange-400'}`}></div>
                  <span className="text-sm font-semibold text-gray-800">{item.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm font-medium text-gray-400">No chronic conditions recorded.</p>
          )}
        </div>
      </div>

      <div className="bg-[#FDF9EE] border border-[#F5E6CC] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#EBCB8B]"></div>
        <p className="text-[10px] font-extrabold text-[#B8860B] uppercase tracking-widest mb-2">Physician's Primary Note</p>
        <p className="text-sm text-gray-700 leading-relaxed font-medium italic">
          "{note}"
        </p>
      </div>
    </div>
  );
};

export default MedicalHistory;