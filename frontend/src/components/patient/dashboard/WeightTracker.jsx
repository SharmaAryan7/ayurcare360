import React from 'react';
import { Activity, TrendingDown, TrendingUp } from 'lucide-react';

// Added profileWeight to the props
const WeightTracker = ({ weightData, profileWeight, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-64 flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="flex-1 bg-gray-50 rounded-2xl"></div>
      </div>
    );
  }

  const safeData = Array.isArray(weightData) ? weightData : [];
  const hasData = safeData.length > 0;

  let currentWeight = '--';
  let trend = 'down';
  let trendValue = '0';
  let labels = [];
  let maxWeight = 0;
  let minWeight = 0;
  const unit = 'kg';

  if (hasData) {
    // If they have historical logs, use the latest log
    const latestEntry = safeData[safeData.length - 1];
    currentWeight = parseFloat(latestEntry.weight).toFixed(1);

    if (safeData.length > 1) {
      const prevEntry = safeData[safeData.length - 2];
      const diff = parseFloat(latestEntry.weight) - parseFloat(prevEntry.weight);
      trendValue = Math.abs(diff).toFixed(1);
      trend = diff <= 0 ? 'down' : 'up';
    }

    const recentData = safeData.slice(-3);
    labels = recentData.map(entry => {
      const d = new Date(entry.log_date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const weights = recentData.map(entry => parseFloat(entry.weight));
    maxWeight = Math.max(...weights);
    minWeight = Math.min(...weights);
  } else if (profileWeight) {
    // FALLBACK: If no logs exist, show the initial weight from their profile
    currentWeight = parseFloat(profileWeight).toFixed(1);
  }

  const isTrendDown = trend === 'down';

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#E7F3EB] p-2.5 rounded-xl text-[#4A7C59]">
            <Activity size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Body Weight</h3>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-extrabold text-gray-900">{currentWeight}</span>
          <span className="text-lg font-bold text-gray-500 ml-1">{unit}</span>
        </div>

        {/* Only show the trend badge if there is actual historical log data to compare */}
        {hasData && trendValue !== '0.0' && (
          <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg mb-1.5 ${isTrendDown ? 'bg-[#E7F3EB] text-[#4A7C59]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
            {isTrendDown ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
            {trendValue}{unit}
          </div>
        )}
      </div>

      <div className="flex-1 mt-4 flex items-end justify-between gap-2 h-32 relative">
        <div className="absolute inset-0 flex flex-col justify-between z-0">
          <div className="border-b border-gray-100 w-full h-0"></div>
          <div className="border-b border-gray-100 w-full h-0"></div>
          <div className="border-b border-gray-100 w-full h-0"></div>
        </div>

        {hasData ? (
          safeData.slice(-3).map((entry, index) => {
            const w = parseFloat(entry.weight);
            const range = maxWeight === minWeight ? 1 : maxWeight - minWeight;
            const percentage = 40 + ((w - minWeight) / range) * 60; 
            
            return (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 z-10 group h-full justify-end">
                <div 
                  className="w-full max-w-[40px] bg-[#E7F3EB] group-hover:bg-[#4A7C59] transition-all duration-500 rounded-t-lg" 
                  style={{ height: `${percentage}%` }}
                ></div>
                <span className="text-xs font-semibold text-gray-400">{labels[index]}</span>
              </div>
            );
          })
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-[#4A7C59] z-10 bg-white/60">
            Initial weight logged. Start tracking daily!
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightTracker;