import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExpertConsultationCard = ({ data }) => {
  const navigate = useNavigate();

  // Safely extract the dynamically recommended doctor's name based on condition.
  // Fallback to a generic title if the data is still loading or unavailable.
  const doctorName = data?.recommendedDoctor || data?.doctorName || data?.doctor_name || 'an Ayurvedic specialist';

  return (
    <div className="bg-[#3A6447] rounded-[24px] p-8 text-white h-full flex flex-col justify-center shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 backdrop-blur-sm">
        <ShieldAlert size={20} className="text-white" />
      </div>

      <h3 className="text-lg font-bold mb-2">Expert Consultation</h3>
      <p className="text-sm text-white/80 font-medium leading-relaxed mb-6">
        Book a quick follow-up with {doctorName} to discuss your current health condition and progress.
      </p>

      <button
        onClick={() => navigate('/patient/book-appointment')}
        className="text-sm font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all w-fit rounded-full outline-none focus:ring-2 focus:ring-white/50"
      >
        Schedule Now
      </button>
    </div>
  );
};

export default ExpertConsultationCard;