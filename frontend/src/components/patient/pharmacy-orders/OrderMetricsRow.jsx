import React from 'react';
import { Package, Truck, ShoppingBag } from 'lucide-react';

const OrderMetricsRow = ({ orders = [] }) => {
  // Dynamic Calculations based on your backend 'order_status' field
  const inProgressCount = orders.filter(o => ['Pending', 'Processing'].includes(o.order_status)).length;
  const shippedCount = orders.filter(o => o.order_status === 'Shipped').length;
  const totalSpent = orders.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
      {/* In Progress */}
      <div className="bg-white rounded-[24px] p-5 md:p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-4 md:gap-5 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#FFF4EB] flex items-center justify-center text-[#D9774B] shrink-0">
          <Package size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">In Progress</p>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 truncate">{inProgressCount < 10 ? `0${inProgressCount}` : inProgressCount} Orders</h3>
        </div>
      </div>

      {/* Shipped */}
      <div className="bg-white rounded-[24px] p-5 md:p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-4 md:gap-5 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#E7F3EB] flex items-center justify-center text-[#4A7C59] shrink-0">
          <Truck size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">Shipped</p>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 truncate">{shippedCount < 10 ? `0${shippedCount}` : shippedCount} Orders</h3>
        </div>
      </div>

      {/* Total Spent */}
      <div className="bg-white rounded-[24px] p-5 md:p-6 border border-[#EFEBE1] shadow-sm flex items-center gap-4 md:gap-5 hover:-translate-y-1 transition-transform duration-300">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-[#F3E8FF] flex items-center justify-center text-[#9333EA] shrink-0">
          <ShoppingBag size={20} className="md:w-6 md:h-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">Total Spent</p>
          <h3 className="text-lg md:text-xl font-extrabold text-gray-900 truncate">₹{totalSpent.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
};

export default OrderMetricsRow;