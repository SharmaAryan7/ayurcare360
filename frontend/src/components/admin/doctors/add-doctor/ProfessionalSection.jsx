import React from 'react';

const ProfessionalSection = ({ formData, onChange, isEditing = true }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">Professional Credentials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Specialization</label>
          <input type="text" name="specialization" value={formData.specialization} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Medical Reg. Number</label>
          <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Qualifications</label>
          <input type="text" name="qualifications" value={formData.qualifications} onChange={onChange} disabled={!isEditing} placeholder="e.g. BAMS, MD Ayurveda" className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Years of Experience</label>
          <input type="number" name="experience" value={formData.experience} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        {formData.status !== undefined && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Verification Status</label>
            <select name="status" value={formData.status} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70 cursor-pointer">
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};
export default ProfessionalSection;