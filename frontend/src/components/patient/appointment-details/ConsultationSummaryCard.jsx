import React from 'react';
import { FileText } from 'lucide-react';

const ConsultationSummaryCard = ({ summary, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-full">
        <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-[#E7F3EB] p-2.5 rounded-xl text-[#4A7C59]">
          <FileText size={20} />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Consultation Summary</h3>
      </div>

      <div className="bg-[#FDF9EE] border border-[#F5E6CC] rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#EBCB8B]"></div>
        <p className="text-sm text-gray-700 leading-relaxed font-medium whitespace-pre-line">
          {summary || "No post-consultation summary has been provided by the practitioner yet."}
        </p>
      </div>
    </div>
  );
};

export default ConsultationSummaryCard;