import React, { useRef } from 'react';
import { Download, Camera } from 'lucide-react';

const ProfileOverviewCard = ({ profile, isEditing, onEditToggle, onChange, onImageUpload, onDownloadPDF }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="bg-[#FAF7F2] rounded-[32px] p-6 flex flex-col md:flex-row gap-8 shadow-sm h-full">

      {/* Image Section */}
      <div className="relative w-40 h-72 rounded-2xl overflow-hidden shrink-0 group">
        <img
          src={profile.avatar || `https://ui-avatars.com/api/?name=${profile.full_name || 'User'}&background=EAE5D9&color=4A7C59&size=150`}
          alt={profile.full_name}
          className="w-full h-full object-cover transition-all duration-300"
        />
        <input type="file" ref={fileInputRef} onChange={onImageUpload} className="hidden" accept="image/*" />

        {isEditing && (
          <div onClick={() => fileInputRef.current.click()} className="absolute inset-0 bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
            <button className="bg-white p-3 rounded-full text-gray-900 shadow-lg hover:scale-105 transition-transform"><Camera size={20} /></button>
          </div>
        )}
        {!isEditing && (
          <div className="absolute bottom-3 left-3 bg-[#D9774B] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Active</div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-xl font-bold text-gray-900 mb-6">{profile.full_name || 'Patient Name'}</h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#FDF9EE] rounded-xl p-3 border border-[#EFEBE1]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Age</p>
            {isEditing ? <input type="number" name="age" value={profile.age || ''} onChange={onChange} className="w-full bg-transparent font-bold text-gray-900 focus:outline-none" /> : <p className="font-bold text-gray-900">{profile.age || '-'}</p>}
          </div>
          <div className="bg-[#FDF9EE] rounded-xl p-3 border border-[#EFEBE1]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
            {isEditing ? (
              <select name="gender" value={profile.gender || ''} onChange={onChange} className="w-full bg-transparent font-bold text-gray-900 focus:outline-none">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : <p className="font-bold text-gray-900">{profile.gender || '-'}</p>}
          </div>
          <div className="col-span-2 bg-[#FDF9EE] rounded-xl p-3 border border-[#EFEBE1]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Constitution (Prakriti)</p>
            {isEditing ? <input type="text" name="prakriti_type" value={profile.prakriti_type || ''} onChange={onChange} className="w-full bg-transparent font-bold text-gray-900 focus:outline-none" /> : <p className="font-bold text-gray-900">{profile.prakriti_type || 'Pending Analysis'}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button onClick={onEditToggle} className={`px-6 py-3 text-sm font-bold rounded-full transition-colors shadow-sm flex-1 cursor-pointer ${isEditing ? 'bg-[#2C4D36] text-white' : 'bg-[#3A6447] hover:bg-[#2C4D36] text-white'}`}>
            {isEditing ? 'Save Profile' : 'Edit Profile'}
          </button>
          <button onClick={onDownloadPDF} className="px-6 py-3 bg-[#EAE5D9] hover:bg-[#D1CFC8] text-gray-800 text-sm font-bold rounded-full transition-colors shadow-sm flex items-center justify-center gap-2 flex-1 cursor-pointer">
            <Download size={16} /> Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};
export default ProfileOverviewCard;