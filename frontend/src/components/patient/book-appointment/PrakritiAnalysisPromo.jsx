import React from 'react';
import { MessageSquare } from 'lucide-react';

const PrakritiAnalysisPromo = () => {
  return (
    <div className="bg-[#79563E] rounded-[24px] p-6 relative overflow-hidden text-white shadow-sm mt-6">
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>

      <h4 className="text-lg font-bold mb-2 relative z-10">Prakriti Analysis</h4>
      <p className="text-sm text-white/80 leading-relaxed mb-4 relative z-10 pr-4">
        Book a session to discover your unique constitution.
      </p>
    </div>
  );
};

export default PrakritiAnalysisPromo;