import React from 'react';

const PersonalInfoSection = ({ formData, onChange, isEditing = true }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">Personal Information</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
        {/* Only show password field on Add or if strictly permitted in Edit */}
        {formData.password !== undefined && (
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Account Password</label>
            <input type="password" name="password" value={formData.password} onChange={onChange} disabled={!isEditing} placeholder={!isEditing ? '********' : 'Enter secure password'} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
          </div>
        )}
        <div className="md:col-span-2">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Clinic Address / Location</label>
          <input type="text" name="address" value={formData.address} onChange={onChange} disabled={!isEditing} className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none disabled:opacity-70" />
        </div>
      </div>
    </div>
  );
};
export default PersonalInfoSection;