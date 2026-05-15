import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../../api/appointmentApi';

const AppointmentInsights = () => {
  const [insight, setInsight] = useState(null);
  const [preparation, setPreparation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch granular data independently
    Promise.allSettled([
      appointmentApi.getAyurvedicInsight().then(setInsight),
      appointmentApi.getPrepInstructions().then(setPreparation)
    ]).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 bg-[#648B74]/50 rounded-2xl h-[220px] animate-pulse"></div>
        <div className="lg:col-span-1 bg-[#7C6CA6]/50 rounded-2xl h-[220px] animate-pulse"></div>
      </div>
    );
  }

  // Safe mapping of dynamic tags
  const tags = preparation?.tags || ["Empty Stomach", "Journal Ready", "Quiet Space"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
      {/* Prepare for next visit */}
      <div className="lg:col-span-2 bg-[#648B74] rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h3 className="text-xl font-bold mb-3">Prepare for your next visit</h3>
          <p className="text-sm md:text-base text-white/90 mb-6 lg:mb-8 max-w-lg">
            {preparation?.message || "Review your pre-consultation guidelines and dietary observations to make the most of your session with Dr. Ananya Iyer."}
          </p>
          <div className="flex flex-wrap gap-3 lg:gap-4">
            {tags.map((tag, idx) => (
              <span key={idx} className="px-3 md:px-4 py-1.5 md:py-2 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm border border-white/10 shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
        {/* Decorative background blob */}
        <div className="absolute right-0 top-0 w-64 md:w-80 h-64 md:h-80 bg-white/10 rounded-full blur-3xl -mr-16 lg:-mr-20 -mt-16 lg:-mt-20"></div>
      </div>

      {/* Ayurvedic Insight */}
      <div className="lg:col-span-1 bg-[#7C6CA6] rounded-2xl p-6 lg:p-8 text-white text-center flex flex-col items-center justify-center relative overflow-hidden shadow-sm">
        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-white/20 rounded-full flex items-center justify-center mb-4 lg:mb-5 backdrop-blur-sm border border-white/10">
          <span className="text-2xl">🕉️</span>
        </div>
        <h4 className="text-base font-bold mb-2 lg:mb-3">Ayurvedic Insight</h4>
        <p className="text-sm text-white/90 italic leading-relaxed px-2">
          "{insight?.content || "Patience is the foundation of healing. Your body knows how to return to balance, we only guide it."}"
        </p>
        <div className="absolute left-0 bottom-0 w-32 lg:w-40 h-32 lg:h-40 bg-white/10 rounded-full blur-2xl -ml-8 lg:-ml-10 -mb-8 lg:-mb-10"></div>
      </div>
    </div>
  );
};

export default AppointmentInsights;