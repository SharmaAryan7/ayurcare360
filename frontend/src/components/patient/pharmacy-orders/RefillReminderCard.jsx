import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RefillReminderCard = ({ data, isLoading }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-[#EAE5D9] rounded-[24px] p-6 md:p-8 relative overflow-hidden h-full min-h-[200px] md:min-h-[220px] flex flex-col justify-center animate-pulse border border-[#DFD9CB]">
        <div className="w-10 h-10 rounded-xl bg-white/50 mb-4 md:mb-5"></div>
        <div className="h-5 md:h-6 bg-gray-300/50 rounded w-1/2 mb-3 md:mb-4"></div>
        <div className="space-y-2 mb-5 md:mb-6">
          <div className="h-3 md:h-4 bg-gray-300/50 rounded w-3/4"></div>
          <div className="h-3 md:h-4 bg-gray-300/50 rounded w-1/2"></div>
        </div>
        <div className="h-10 bg-gray-300/50 rounded-full w-32"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-[#EAE5D9] rounded-[24px] p-6 md:p-8 relative overflow-hidden h-full flex flex-col justify-center border border-[#DFD9CB]">
        <div className="absolute -bottom-16 -right-16 w-40 md:w-48 h-40 md:h-48 bg-[#DFD9CB] rounded-full opacity-50"></div>
        
        <div className="relative z-10">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 md:mb-5 shadow-sm text-[#4A7C59]">
            <Sparkles size={18} className="md:w-5 md:h-5" />
          </div>

          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">Begin Your Wellness Journey</h3>
          <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed mb-5 md:mb-6 max-w-[280px]">
            You haven't ordered any remedies yet. Explore our pharmacy for 100% organic Ayurvedic products curated for your health.
          </p>

          <button
            onClick={() => navigate('/patient/pharmacy-store')}
            className="bg-[#4A7C59] hover:bg-[#386044] text-white text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest py-3 px-5 md:py-3.5 md:px-6 rounded-full transition-colors shadow-sm w-fit"
          >
            Explore Pharmacy
          </button>
        </div>
      </div>
    );
  }

  const productName = data.productName;
  const orderId = data.orderId;
  const daysLeft = data.daysLeft;

  return (
    <div className="bg-[#EAE5D9] rounded-[24px] p-6 md:p-8 relative overflow-hidden h-full flex flex-col justify-center border border-[#DFD9CB]">
      <div className="absolute -bottom-16 -right-16 w-40 md:w-48 h-40 md:h-48 bg-[#DFD9CB] rounded-full opacity-50"></div>

      <div className="relative z-10">
        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 md:mb-5 shadow-sm text-[#9A6E44]">
          <PackageOpen size={18} className="md:w-5 md:h-5" />
        </div>

        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">
          {daysLeft === 0 ? 'Refill Required' : 'Refill Reminder'}
        </h3>
        
        <p className="text-xs md:text-sm text-gray-700 font-medium leading-relaxed mb-5 md:mb-6 max-w-[280px]">
          {daysLeft === 0 
            ? `Your supply of '${productName}' from Order #${orderId} has likely run out. Stay on track with your regimen!`
            : `Your '${productName}' from Order #${orderId} is estimated to run out in ${daysLeft} days.`
          }
        </p>

        <button
          onClick={() => navigate('/patient/pharmacy-store')}
          className="bg-[#9A6E44] hover:bg-[#835A35] text-white text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest py-3 px-5 md:py-3.5 md:px-6 rounded-full transition-colors shadow-sm w-fit"
        >
          Reorder Now
        </button>
      </div>
    </div>
  );
};

export default RefillReminderCard;