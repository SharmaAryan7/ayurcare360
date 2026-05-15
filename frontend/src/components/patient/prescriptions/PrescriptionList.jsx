import React from 'react';
import { Pill, Calendar, Clock, AlertCircle, Download } from 'lucide-react';

const PrescriptionList = ({ prescriptions = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-[#EFEBE1] rounded-3xl p-6 h-[220px] animate-pulse flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-2xl shrink-0"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-100 rounded w-1/3"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-14 bg-gray-50 rounded-2xl"></div>
              <div className="h-14 bg-gray-50 rounded-2xl"></div>
            </div>
            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <div className="h-4 bg-gray-100 rounded w-1/2"></div>
              <div className="h-6 w-6 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (prescriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
          <Pill size={32} className="text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Active Prescriptions</h3>
        <p className="text-gray-500 text-sm max-w-md mx-auto">
          You currently have no active medicinal regimens. Consult with your practitioner to update your wellness plan.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {prescriptions.map((rx) => (
        <div key={rx.id || rx._id} className="bg-white border border-[#EFEBE1] rounded-3xl p-6 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FDF9EE] rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>

          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#E7F3EB] rounded-2xl flex items-center justify-center text-[#4A7C59]">
                <Pill size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">{rx.medicine_name}</h3>
                <span className="text-[10px] font-extrabold text-[#8B6A47] uppercase tracking-widest bg-[#FDF9EE] px-2 py-0.5 rounded-full mt-1 inline-block border border-[#F5E6CC]">
                  {rx.dosage || 'Standard Dose'}
                </span>
              </div>
            </div>
            {rx.is_active !== false && (
              <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#4A7C59] uppercase tracking-widest bg-[#E7F3EB] px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-[#4A7C59] rounded-full animate-pulse"></span> Active
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
              <Clock size={16} className="text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Timing</p>
                <p className="text-sm font-bold text-gray-900">{rx.timing || 'As Directed'}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3 flex items-center gap-3">
              <Calendar size={16} className="text-gray-400" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Duration</p>
                <p className="text-sm font-bold text-gray-900">{rx.duration || 'Ongoing'}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[#EFEBE1]">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <AlertCircle size={14} className="text-[#D9774B]" />
              {rx.instructions || 'Take with warm water'}
            </div>
            <button className="text-[#4A7C59] hover:bg-[#E7F3EB] p-2 rounded-full transition-colors" title="Download Details">
              <Download size={18} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrescriptionList;