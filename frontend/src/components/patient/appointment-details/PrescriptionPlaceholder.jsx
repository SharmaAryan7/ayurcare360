import React from 'react';
import { FileLock2 } from 'lucide-react';

const PrescriptionPlaceholder = () => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full flex flex-col items-center justify-center text-center min-h-[250px]">
      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
        <FileLock2 size={28} />
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">Prescription Unavailable</h3>
      <p className="text-sm text-gray-500 font-medium max-w-sm">
        Your practitioner will upload the prescription and summary details here after your consultation is completed.
      </p>
    </div>
  );
};

export default PrescriptionPlaceholder;