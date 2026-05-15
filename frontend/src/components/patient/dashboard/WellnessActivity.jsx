import React from 'react';
import { Activity } from 'lucide-react';

const WellnessActivity = ({ activityData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-64 flex flex-col">
        <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="flex-1 bg-gray-50 rounded-2xl"></div>
      </div>
    );
  }

  const safeData = activityData || [];

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-[#FDF9EE] p-2.5 rounded-xl text-[#8B6A47]">
            <Activity size={20} />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Weekly Activity</h3>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#4A7C59]"></span> Yoga
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EBCB8B]"></span> Meditation
          </div>
        </div>
      </div>

      {/* Tailwind Stacked Bar Chart */}
      <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-3 h-40 pt-4">
        {safeData.length > 0 ? (
          safeData.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1 h-full justify-end group">
              <div className="w-full max-w-[28px] sm:max-w-[40px] flex flex-col justify-end h-full gap-1">
                {/* Yoga Bar */}
                <div
                  className="bg-[#4A7C59] rounded-t-md opacity-90 group-hover:opacity-100 transition-opacity w-full"
                  style={{ height: `${item.yoga}%` }}
                  title={`Yoga: ${item.yoga} mins`}
                ></div>
                {/* Meditation Bar */}
                <div
                  className="bg-[#EBCB8B] rounded-b-md opacity-90 group-hover:opacity-100 transition-opacity w-full"
                  style={{ height: `${item.meditation}%` }}
                  title={`Meditation: ${item.meditation} mins`}
                ></div>
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-gray-400 mt-2">{item.day}</span>
            </div>
          ))
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm font-medium text-gray-400">
            No activity logged this week.
          </div>
        )}
      </div>
    </div>
  );
};

export default WellnessActivity;