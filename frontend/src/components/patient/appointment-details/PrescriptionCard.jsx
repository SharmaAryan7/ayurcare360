import React from 'react';
import { Pill, Clock, Download } from 'lucide-react';

const PrescriptionCard = ({ medications, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-full">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-24 bg-gray-100 rounded-2xl"></div>
          <div className="h-24 bg-gray-100 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const safeMedications = Array.isArray(medications) ? medications : [];

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#F3E8FF] p-2.5 rounded-xl text-[#9333EA]">
            <Pill size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Prescription</h3>
        </div>
        <button className="flex items-center gap-2 text-sm font-bold text-[#4A7C59] hover:text-[#2C4D36] transition-colors">
          <Download size={16} /> Download PDF
        </button>
      </div>

      {safeMedications.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {safeMedications.map((med, idx) => (
            <div key={idx} className="border border-[#EFEBE1] rounded-2xl p-4 flex flex-col justify-between hover:border-[#4A7C59] transition-colors group">
              <div>
                <h4 className="font-bold text-gray-900 text-lg mb-1">{med.name}</h4>
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FDF9EE] text-[#8B6A47] text-[10px] font-extrabold uppercase tracking-widest mb-4">
                  {med.dosage || 'As Directed'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 p-2.5 rounded-xl border border-gray-100">
                <Clock size={14} className="text-gray-400" />
                {med.duration || 'Ongoing'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500 font-medium border border-dashed border-gray-300 rounded-2xl">
          No medications prescribed for this session.
        </div>
      )}
    </div>
  );
};

export default PrescriptionCard;