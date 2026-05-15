import React from 'react';
import { X, AlertTriangle } from 'lucide-react';

const CancelAppointmentModal = ({ isOpen, appointment, onClose, onConfirm }) => {
  if (!isOpen) return null;

  const doctorName = appointment?.doctorName || 'your practitioner';
  const date = appointment?.date || 'this date';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden transform transition-all">
        <div className="p-6 md:p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-6">
            <AlertTriangle size={32} />
          </div>

          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Cancel Appointment?</h2>
          <p className="text-sm text-gray-500 font-medium mb-8">
            Are you sure you want to cancel your session with <span className="font-bold text-gray-700">{doctorName}</span> on <span className="font-bold text-gray-700">{date}</span>? This action cannot be undone.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-colors"
            >
              Keep It
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl shadow-md shadow-red-500/20 transition-colors"
            >
              Yes, Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelAppointmentModal;