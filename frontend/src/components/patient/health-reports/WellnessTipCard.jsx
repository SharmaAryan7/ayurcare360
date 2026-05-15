import React from 'react';

const WellnessTipCard = ({ tip, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#EAE5D9] rounded-[24px] p-6 border border-[#DFD9CB] animate-pulse">
        <div className="h-3 bg-gray-300 rounded w-24 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#EAE5D9] rounded-[24px] p-6 border border-[#DFD9CB]">
      <h3 className="text-[11px] font-bold text-[#79563E] uppercase tracking-widest mb-2">Wellness Tip</h3>
      <p className="text-sm font-semibold text-gray-800 leading-relaxed">
        {tip?.content || "Stay hydrated with copper-infused water for natural detoxification."}
      </p>
    </div>
  );
};

export default WellnessTipCard;