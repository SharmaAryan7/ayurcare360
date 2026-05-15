import React from 'react';
import { Pill, Droplets, Moon } from 'lucide-react';

const QuickMetrics = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      // Added grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 for better tablet flow
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#EFEBE1] shadow-sm animate-pulse h-28"></div>
        ))}
      </div>
    );
  }

  const getIcon = (type) => {
    switch (type) {
      case 'medication': return <div className="bg-[#E7F3EB] text-[#4A7C59] p-3 rounded-2xl shrink-0"><Pill size={22} /></div>;
      case 'hydration': return <div className="bg-[#EBF4FF] text-[#3B82F6] p-3 rounded-2xl shrink-0"><Droplets size={22} /></div>;
      case 'sleep': return <div className="bg-[#F3E8FF] text-[#9333EA] p-3 rounded-2xl shrink-0"><Moon size={22} /></div>;
      default: return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {metrics && metrics.length > 0 ? (
        metrics.map((metric, idx) => (
          <div key={idx} className="bg-white rounded-[24px] p-5 sm:p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-4 sm:gap-5 hover:-translate-y-1 transition-transform duration-300">
            {getIcon(metric.type)}
            <div className="min-w-0 flex-1"> {/* min-w-0 allows truncate to work properly in flexbox */}
              <p className="text-[9px] sm:text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-1 truncate">{metric.title}</p>
              <h4 className="text-base sm:text-lg font-bold text-gray-900 leading-tight truncate">{metric.value}</h4>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium mt-1 truncate">{metric.subtitle}</p>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-6 text-gray-400 font-medium text-sm border border-dashed border-gray-300 rounded-2xl">
          No quick metrics available to display.
        </div>
      )}
    </div>
  );
};

export default QuickMetrics;