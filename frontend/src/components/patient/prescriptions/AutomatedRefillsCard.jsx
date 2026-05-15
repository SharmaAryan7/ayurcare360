import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const AutomatedRefillsCard = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#EAE5D9] rounded-[24px] p-8 relative overflow-hidden h-full flex flex-col justify-center border border-[#DFD9CB]">
      {/* Decorative background element */}
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#DFD9CB] rounded-full opacity-50"></div>

      <div className="relative z-10">
        {/* Added a nice icon to match the other cards */}
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-5 shadow-sm text-[#9A6E44]">
          <ShoppingBag size={20} />
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3">Fulfill Your Prescription</h3>
        <p className="text-sm text-gray-700 font-medium leading-relaxed mb-6 max-w-[340px]">
          Ready to start your healing journey? Get 100% authentic Ayurvedic medicines prescribed by your doctor delivered straight to your doorstep.
        </p>
        
        <button
          onClick={() => navigate('/patient/pharmacy-store')}
          className="bg-[#9A6E44] hover:bg-[#835A35] text-white text-[11px] font-extrabold uppercase tracking-widest py-3.5 px-6 rounded-full transition-colors shadow-sm w-fit"
        >
          Visit Pharmacy
        </button>
      </div>
    </div>
  );
};

export default AutomatedRefillsCard;