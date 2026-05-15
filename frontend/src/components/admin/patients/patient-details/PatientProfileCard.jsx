import React from 'react';
import { Phone, Mail, MapPin, User as UserIcon } from 'lucide-react';

const PatientProfileCard = ({ patient }) => {
  if (!patient) return null;

  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 items-start h-full">
      <div className="w-32 h-32 rounded-full bg-[#FDF9EE] text-[#4A7C59] flex items-center justify-center font-bold text-4xl border-4 border-[#4A7C59]/10 shrink-0">
        {patient.full_name?.charAt(0) || 'P'}
      </div>

      <div className="flex-1 w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{patient.full_name}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-500">
            <span>{patient.age ? `${patient.age} Years` : 'Age N/A'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span>{patient.gender || 'Gender N/A'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span>Blood Group: <span className="text-red-600">{patient.blood_group || 'N/A'}</span></span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-gray-400" />
            <span className="font-bold text-gray-700">{patient.phone || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span className="font-bold text-gray-700">{patient.email || 'N/A'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm sm:col-span-2">
            <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <span className="font-bold text-gray-700 leading-relaxed">
              {patient.address || 'Address not provided'}
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Emergency Contact</p>
          <div className="flex items-center gap-3 bg-red-50 p-4 rounded-2xl w-fit">
            <UserIcon size={16} className="text-red-600" />
            <div>
              <p className="text-sm font-bold text-red-900">{patient.emergency_contact_name || 'Not Provided'}</p>
              <p className="text-xs font-bold text-red-600">{patient.emergency_contact_phone || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PatientProfileCard;