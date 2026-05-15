import React from 'react';
import { Activity } from 'lucide-react';

const PatientMedicalInfoCard = ({ medicalInfo }) => {
  if (!medicalInfo) return null;

  return (
    <div className="bg-[#FDF9EE] rounded-3xl p-8 shadow-sm border border-[#EAE5D9] h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-amber-100 text-amber-700 rounded-lg"><Activity size={18} /></div>
        <h3 className="text-lg font-extrabold text-gray-900">Medical Profile</h3>
      </div>

      <div className="space-y-6 flex-1">
        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Prakriti Type</p>
          <span className="px-4 py-1.5 bg-[#4A7C59] text-white text-xs font-bold rounded-full">
            {medicalInfo.prakriti_type || 'Unassessed'}
          </span>
        </div>

        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Allergies</p>
          <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-bold text-red-600">
            {medicalInfo.allergies || 'None reported'}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Chronic Conditions</p>
          <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 leading-relaxed">
            {medicalInfo.conditions || 'No chronic conditions reported.'}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-2">Current Medications</p>
          <div className="bg-white p-3 rounded-xl border border-gray-100 text-sm font-bold text-gray-700 leading-relaxed">
            {medicalInfo.medications || 'Not currently on any medications.'}
          </div>
        </div>
      </div>
    </div>
  );
};
export default PatientMedicalInfoCard;