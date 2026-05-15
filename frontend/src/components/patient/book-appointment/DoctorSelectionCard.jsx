import React from 'react';
import { Star } from 'lucide-react';

const DoctorSelectionCard = ({ doctor, isSelected, onSelect, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-[24px] p-6 border border-[#EFEBE1] bg-white shadow-sm min-w-[300px] md:min-w-[320px] shrink-0 animate-pulse h-[220px] flex flex-col justify-between">
        <div className="flex gap-4 mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 shrink-0"></div>
          <div className="flex-1 space-y-3 mt-2">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            <div className="h-3 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>
        <div className="flex justify-between items-end pt-5 border-t border-[#EFEBE1]">
          <div className="h-8 bg-gray-100 rounded w-16"></div>
          <div className="h-10 bg-gray-200 rounded-full w-28"></div>
        </div>
      </div>
    );
  }

  // Exact mapping for the backend properties
  const docId = doctor?.doctor_id || doctor?.id || doctor?._id;
  const docName = doctor?.full_name || doctor?.name || 'Practitioner';
  const nameParts = docName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';
  const specialty = doctor?.specialization || doctor?.specialty || 'Specialist';
  
  // Dynamic fee extraction
  const fee = doctor?.consultation_fee || doctor?.consultation_fees || doctor?.fee || doctor?.fees || '50';
  
  // Dynamic Image extraction targeting the updated backend query
  const avatarUrl = doctor?.profile_image_url || doctor?.avatar || doctor?.profile_picture;

  return (
    <div
      onClick={() => onSelect(docId)}
      className={`rounded-[24px] p-6 border min-w-[300px] md:min-w-[320px] shrink-0 cursor-pointer transition-all duration-300 ${isSelected
          ? 'bg-white border-[#4A7C59] shadow-md relative'
          : 'bg-[#F4F1EB] border-[#EFEBE1] shadow-sm hover:border-[#D1CFC8] hover:shadow-md'
        }`}
    >
      <div className="flex gap-4 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-[#EFEBE1] border border-[#EFEBE1] overflow-hidden shrink-0 flex items-center justify-center text-[#4A7C59] text-2xl font-bold">
          <img
            src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=FDF9EE&color=3A6447`}
            alt={docName}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(docName)}&background=FDF9EE&color=3A6447`;
            }}
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 leading-tight">
            Dr. {firstName}<br />{lastName}
          </h3>
          <p className="text-xs text-gray-500 font-medium leading-tight mt-1">
            {specialty.split(' ').map((word, i) => i === 1 ? <React.Fragment key={i}><br />{word}</React.Fragment> : ` ${word}`)}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between pt-5 border-t border-[#EFEBE1]">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consultation<br />Fee</p>
          <p className="text-lg font-bold text-gray-900">₹{fee}</p>
        </div>
        <button
          className={`px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${isSelected
              ? 'bg-[#3A6447] text-white'
              : 'bg-white text-gray-500 border border-[#EFEBE1] hover:bg-gray-50'
            }`}
        >
          {isSelected ? 'Selected' : 'Select Doctor'}
        </button>
      </div>
    </div>
  );
};

export default DoctorSelectionCard;