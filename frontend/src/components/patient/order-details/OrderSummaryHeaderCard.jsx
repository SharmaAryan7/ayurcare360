import React from 'react';

const OrderSummaryHeaderCard = ({ order, delivery, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm mb-8 animate-pulse h-32 flex items-center justify-between">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    );
  }

  const safeOrder = order || {};

  // Format Date gracefully
  const orderDate = safeOrder.created_at
    ? new Date(safeOrder.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '--';

  // Fallback for estimated delivery if not provided by backend
  const estimatedDelivery = delivery?.estimatedDate || '--';

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return 'bg-[#F3E8FF] text-[#9333EA]';
      case 'delivered': return 'bg-[#E7F3EB] text-[#4A7C59]';
      default: return 'bg-[#FEF5D3] text-[#A67C00]'; // Processing/Pending
    }
  };

  const getStatusDotStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'shipped': return 'bg-[#9333EA]';
      case 'delivered': return 'bg-[#4A7C59]';
      default: return 'bg-[#A67C00]';
    }
  };

  return (
    <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ORDER ID</p>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">AC-{safeOrder.id || '--'}</h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ORDER DATE</p>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">{orderDate}</h2>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">ESTIMATED DELIVERY</p>
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-extrabold text-[#A67C00] tracking-tight">{estimatedDelivery}</h2>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${getStatusStyle(safeOrder.order_status)}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${getStatusDotStyle(safeOrder.order_status)}`}></div>
              {safeOrder.order_status || 'PROCESSING'}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderSummaryHeaderCard;