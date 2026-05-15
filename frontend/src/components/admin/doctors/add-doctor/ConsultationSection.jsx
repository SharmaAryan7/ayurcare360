import React from 'react';

const ConsultationSection = ({ formData, onChange, isEditing = true }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">Consultation Logistics</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Consultation Fee (₹)</label>
          <input type="number" name="fees" value={formData.fees} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Start Time</label>
            <input type="time" name="startTime" value={formData.startTime} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">End Time</label>
            <input type="time" name="endTime" value={formData.endTime} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConsultationSection;