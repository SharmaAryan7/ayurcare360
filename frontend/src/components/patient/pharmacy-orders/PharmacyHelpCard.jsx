import React from 'react';
import { HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PharmacyHelpCard = ({ isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-[#3A6447] rounded-[24px] p-8 h-full min-h-[220px] flex flex-col justify-center shadow-sm animate-pulse border border-[#2C4D36]">
        <div className="w-10 h-10 rounded-xl bg-white/10 mb-5"></div>
        <div className="h-6 bg-white/20 rounded w-1/2 mb-4"></div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-white/10 rounded w-full"></div>
          <div className="h-4 bg-white/10 rounded w-3/4"></div>
        </div>
        <div className="h-4 bg-white/20 rounded w-32 mt-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#3A6447] rounded-[24px] p-8 text-white h-full flex flex-col justify-center shadow-sm">
      <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-5 backdrop-blur-sm">
        <HelpCircle size={20} className="text-white" />
      </div>

      <h3 className="text-xl font-bold mb-2">Need Assistance?</h3>
      <p className="text-sm text-white/80 font-medium leading-relaxed mb-6">
        Have questions about a recent delivery or a specific herbal formulation? Our pharmacy team is here to guide you.
      </p>

      <button
        onClick={() => navigate('/contact')}
        className="text-sm font-bold text-white underline underline-offset-4 decoration-white/40 hover:decoration-white transition-all w-fit rounded-full outline-none focus:ring-2 focus:ring-white/50 cursor-pointer"
      >
        Contact Pharmacy
      </button>
    </div>
  );
};

export default PharmacyHelpCard;