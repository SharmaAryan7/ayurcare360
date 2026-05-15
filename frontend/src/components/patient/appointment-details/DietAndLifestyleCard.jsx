import React from 'react';
import { Leaf, CheckCircle2 } from 'lucide-react';

const DietAndLifestyleCard = ({ plan, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#FDFBF7] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-64 mb-6"></div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-8 bg-gray-100 rounded-xl w-3/4"></div>
        </div>
      </div>
    );
  }

  const safeRecommendations = plan?.recommendations && Array.isArray(plan.recommendations) ? plan.recommendations : [];

  return (
    <div className="bg-[#FDFBF7] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#E7F3EB] rounded-full opacity-50 blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="bg-[#E7F3EB] p-2.5 rounded-xl text-[#4A7C59]">
          <Leaf size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Diet & Lifestyle Plan</h3>
      </div>

      {safeRecommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {safeRecommendations.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <CheckCircle2 size={18} className="text-[#4A7C59] shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-gray-700 leading-relaxed">{item}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-[#EFEBE1] text-center text-sm font-medium text-gray-500 shadow-sm relative z-10">
          No specific diet or lifestyle recommendations provided.
        </div>
      )}
    </div>
  );
};

export default DietAndLifestyleCard;