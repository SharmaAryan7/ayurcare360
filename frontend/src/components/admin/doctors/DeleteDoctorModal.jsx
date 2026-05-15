import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteDoctorModal = ({ doctor, onClose, onConfirm }) => {
  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden scale-in-center">
        <div className="p-6 sm:p-8 flex flex-col items-center text-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X size={18} />
          </button>

          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle size={32} />
          </div>

          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Remove Doctor Profile?</h3>
          <p className="text-sm font-medium text-gray-500 leading-relaxed mb-8">
            You are about to permanently delete <span className="font-bold text-gray-900">{doctor.name}'s</span> profile. This action will remove their access and delist them from the platform. This cannot be undone.
          </p>

          <div className="flex w-full gap-3">
            <button onClick={onClose} className="flex-1 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-2xl transition-colors text-sm">
              Keep Profile
            </button>
            <button onClick={onConfirm} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl transition-colors shadow-sm text-sm">
              Yes, Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DeleteDoctorModal;