import React from 'react';
import { User } from 'lucide-react';

const AccountInfoCard = ({ data, isEditing, onChange }) => {
  if (!data) return null;

  return (
    <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm h-full">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-[#EFEBE1]">
        <div className="w-10 h-10 rounded-full bg-[#E7F3EB] flex items-center justify-center text-[#2D5A27]">
          <User size={20} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Account Details</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Full Name */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name</label>
          {isEditing ? (
            <input
              type="text"
              name="full_name"
              value={data.full_name || ''}
              onChange={(e) => onChange('account', e.target.name, e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#4A7C59] transition-colors"
            />
          ) : (
            <p className="text-sm font-bold text-gray-900 p-3 bg-gray-50 rounded-xl border border-transparent">{data.full_name || 'Not Set'}</p>
          )}
        </div>

        {/* Email Address (Usually uneditable without verification flow) */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
          <p className="text-sm font-bold text-gray-500 p-3 bg-[#FAF7F2] rounded-xl border border-[#EFEBE1] cursor-not-allowed">
            {data.email || 'No email linked'}
          </p>
        </div>

        {/* Mobile Number */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={data.phone || ''}
              onChange={(e) => onChange('account', e.target.name, e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#4A7C59] transition-colors"
            />
          ) : (
            <p className="text-sm font-bold text-gray-900 p-3 bg-gray-50 rounded-xl border border-transparent">{data.phone || 'Not Set'}</p>
          )}
        </div>

        {/* Language */}
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Language</label>
          {isEditing ? (
            <select
              name="language"
              value={data.language || 'English'}
              onChange={(e) => onChange('account', e.target.name, e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#4A7C59] transition-colors appearance-none cursor-pointer"
            >
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
              <option value="Sanskrit">Sanskrit</option>
            </select>
          ) : (
            <p className="text-sm font-bold text-gray-900 p-3 bg-gray-50 rounded-xl border border-transparent">{data.language || 'English'}</p>
          )}
        </div>

        {/* Time Zone */}
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Time Zone</label>
          {isEditing ? (
            <select
              name="time_zone"
              value={data.time_zone || 'Asia/Kolkata (IST)'}
              onChange={(e) => onChange('account', e.target.name, e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none focus:border-[#4A7C59] transition-colors appearance-none cursor-pointer"
            >
              <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
              <option value="America/New_York (EST)">America/New_York (EST)</option>
              <option value="Europe/London (GMT)">Europe/London (GMT)</option>
            </select>
          ) : (
            <p className="text-sm font-bold text-gray-900 p-3 bg-gray-50 rounded-xl border border-transparent">{data.time_zone || 'Asia/Kolkata (IST)'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;