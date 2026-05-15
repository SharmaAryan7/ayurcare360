import React from 'react';
import { UserSquare2 } from 'lucide-react';

const PersonalDetailsCard = ({ profile, isEditing, onChange }) => (
  <div className="bg-white rounded-[32px] p-8 shadow-sm h-full flex flex-col">
    <UserSquare2 size={20} className="text-[#4A7C59] mb-6" />
    <h3 className="text-sm font-bold text-gray-900 mb-6">Personal Details</h3>
    <div className="space-y-5 flex-1">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Full Name</p>
        {isEditing ? <input type="text" name="full_name" value={profile.full_name || ''} onChange={onChange} className="w-full bg-[#FAF7F2] p-2 rounded-lg text-sm font-bold outline-none" disabled /> : <p className="text-sm font-bold text-gray-900">{profile.full_name}</p>}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Date of Birth</p>
        {isEditing ? <input type="date" name="dob" value={profile.dob ? profile.dob.split('T')[0] : ''} onChange={onChange} className="w-full bg-[#FAF7F2] p-2 rounded-lg text-sm font-bold outline-none" /> : <p className="text-sm font-bold text-gray-900">{profile.dob ? new Date(profile.dob).toLocaleDateString() : 'Not Set'}</p>}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Gender</p>
        {isEditing ? (
          <select name="gender" value={profile.gender || ''} onChange={onChange} className="w-full bg-[#FAF7F2] p-2 rounded-lg text-sm font-bold outline-none">
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        ) : <p className="text-sm font-bold text-gray-900">{profile.gender || 'Not Set'}</p>}
      </div>
    </div>
  </div>
);
export default PersonalDetailsCard;