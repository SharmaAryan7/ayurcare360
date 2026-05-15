import React from 'react';
import { Receipt, Package, TrendingUp } from 'lucide-react';

const OrderMetricsRow = ({ metrics }) => {
  // Safe fallbacks if metrics haven't loaded yet
  const todaysRevenue = metrics?.todaysRevenue || 0;
  const pendingTasks = metrics?.pendingTasks || 0;
  const growthRate = metrics?.growthRate || '0%';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

      {/* Today's Revenue */}
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-[#E7F3EB] flex items-center justify-center text-[#3A6447] shrink-0">
          <Receipt size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Today's Revenue</p>
          <h3 className="text-2xl font-extrabold text-gray-900">
            ₹{Number(todaysRevenue).toLocaleString()}
          </h3>
        </div>
      </div>

      {/* Pending Tasks */}
      <div className="bg-white rounded-[24px] p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-5">
        <div className="w-12 h-12 rounded-full bg-[#FEF5D3] flex items-center justify-center text-[#A67C00] shrink-0">
          <Package size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Pending Tasks</p>
          <h3 className="text-2xl font-extrabold text-gray-900">
            {pendingTasks} {pendingTasks === 1 ? 'Order' : 'Orders'}
          </h3>
        </div>
      </div>

      {/* Growth Rate (Solid Green Card) */}
      <div className="bg-[#3A6447] rounded-[24px] p-6 shadow-sm flex items-center gap-5 border border-[#2C4D36]">
        <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
          <TrendingUp size={24} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">Growth Rate</p>
          <h3 className="text-2xl font-extrabold text-white">{growthRate}</h3>
        </div>
      </div>

    </div>
  );
};

export default OrderMetricsRow;