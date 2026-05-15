import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AppointmentsHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-end mb-10">
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Appointments</h1>
        <p className="text-gray-500 text-lg">
          Manage your upcoming holistic consultations and review your wellness journey history.
        </p>
      </div>
      <button
        onClick={() => navigate('/patient/book-appointment')}
        className="bg-[#4A7C59] hover:bg-[#3d6649] text-white px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 transition-colors shadow-sm"
      >
        <Plus size={20} />
        Book New Consultation
      </button>
    </div>
  );
};

export default AppointmentsHeader;