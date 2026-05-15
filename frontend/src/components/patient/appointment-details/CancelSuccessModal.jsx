import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const CancelSuccessModal = ({ isOpen, onGoDashboard, onScheduleNew }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-[#E7F3EB] rounded-full flex items-center justify-center text-[#4A7C59] mb-6 shadow-inner">
            <CheckCircle2 size={40} />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Successfully Cancelled</h2>
          <p className="text-sm text-gray-500 font-medium mb-8 px-4">
            Your appointment has been cancelled. If a refund is applicable, it will be processed shortly.
          </p>

          <div className="flex flex-col w-full gap-3">
            <button
              onClick={onScheduleNew}
              className="w-full bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-3.5 rounded-2xl shadow-sm transition-colors"
            >
              Schedule New Session
            </button>
            <button
              onClick={onGoDashboard}
              className="w-full bg-white border border-[#EFEBE1] hover:bg-gray-50 text-gray-700 font-bold py-3.5 rounded-2xl transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelSuccessModal;