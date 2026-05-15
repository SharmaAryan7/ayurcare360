import React from 'react';

const QuickInsightsCard = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm animate-pulse h-32 flex flex-col justify-between">
        <div className="h-3 bg-gray-200 rounded w-24"></div>
        <div className="flex justify-between items-end">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-10"></div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
    );
  }

  const storageUsed = insights?.storageUsed || 15;
  const nextTest = insights?.nextTestDate || 'No upcoming tests';

  return (
    <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm">
      <h3 className="text-[11px] font-bold text-amber-800 uppercase tracking-widest mb-4">Quick Insights</h3>

      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-gray-900">Storage Used</span>
        <span className="text-sm font-bold text-[#4A7C59]">{storageUsed}%</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#EFEBE1] rounded-full h-2.5 mb-4 overflow-hidden">
        <div className="bg-[#4A7C59] h-2.5 rounded-full transition-all duration-500" style={{ width: `${storageUsed}%` }}></div>
      </div>

      <p className="text-[10px] font-medium text-gray-400">Next scheduled tests: {nextTest}</p>
    </div>
  );
};

export default QuickInsightsCard;