import React from 'react';
import { AtSign } from 'lucide-react';

const ContactInfoCard = ({ profile, isEditing, onChange }) => (
  <div className="bg-white rounded-[32px] p-8 shadow-sm h-full flex flex-col">
    <AtSign size={20} className="text-[#4A7C59] mb-6" />
    <h3 className="text-sm font-bold text-gray-900 mb-6">Contact Info</h3>
    <div className="space-y-5 flex-1">
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
        {isEditing ? <input type="email" name="email" value={profile.email || ''} onChange={onChange} className="w-full bg-[#FAF7F2] p-2 rounded-lg text-sm font-bold outline-none" disabled /> : <p className="text-sm font-bold text-gray-900">{profile.email || 'Not provided'}</p>}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Mobile</p>
        {isEditing ? <input type="text" name="phone" value={profile.phone || ''} onChange={onChange} className="w-full bg-[#FAF7F2] p-2 rounded-lg text-sm font-bold outline-none" disabled /> : <p className="text-sm font-bold text-gray-900">{profile.phone || 'Not provided'}</p>}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Address</p>
        {isEditing ? <textarea name="address" value={profile.address || ''} onChange={onChange} rows={3} className="w-full bg-[#FAF7F2] p-2 rounded-lg text-sm font-bold outline-none resize-none" /> : <p className="text-sm font-medium text-gray-600 leading-relaxed">{profile.address || 'No address added'}</p>}
      </div>
    </div>
  </div>
);
export default ContactInfoCard;