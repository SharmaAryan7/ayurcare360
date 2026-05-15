import React from 'react';
import { Truck, Mail, Phone, CreditCard, Sparkles } from 'lucide-react';

const OrderInfoSidePanel = ({ payment, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="bg-[#3A6447] rounded-[24px] p-6 h-64 border border-[#2C4D36]"></div>
        <div className="bg-[#3A6447] rounded-[24px] p-6 h-64 border border-[#2C4D36]"></div>
        <div className="bg-[#FDF9EE] rounded-[24px] p-6 h-32 border border-[#EFEBE1]"></div>
      </div>
    );
  }

  const safePayment = payment || {};
  const total = parseFloat(safePayment.total_amount || 0).toFixed(2);
  const address = safePayment.shipping_address || 'Address not provided.';
  const method = safePayment.payment_method || 'Online';
  const status = safePayment.payment_status || 'Pending';

  return (
    <div className="flex flex-col gap-6">

      {/* 1. Delivery Address Card */}
      <div className="bg-[#3A6447] text-white rounded-[24px] p-6 shadow-sm border border-[#2C4D36]">
        <div className="flex items-center gap-3 mb-6">
          <Truck size={20} />
          <h3 className="text-lg font-bold">Delivery Address</h3>
        </div>

        <div className="bg-[#FAF7F2] text-gray-800 rounded-xl p-5 mb-6">
          <h4 className="text-sm font-bold mb-1.5">Home Address</h4>
          <p className="text-xs font-medium leading-relaxed max-w-[200px]">
            {address}
          </p>
        </div>

        <div className="space-y-3 mb-8 text-white/90">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <Phone size={14} /> Registered Mobile
          </div>
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <Mail size={14} /> Registered Email
          </div>
        </div>

        <button className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-3.5 rounded-full transition-colors text-sm shadow-sm">
          Track Shipment
        </button>
      </div>

      {/* 2. Payment Summary Card */}
      <div className="bg-[#3A6447] text-white rounded-[24px] p-6 shadow-sm border border-[#2C4D36]">
        <div className="flex items-center gap-3 mb-6">
          <CreditCard size={20} />
          <h3 className="text-lg font-bold">Payment Summary</h3>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm font-medium text-white/80">
            <span>Product Total</span>
            <span className="text-white font-bold">₹{(total > 4.5 ? total - 4.5 : total).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-white/80">
            <span>Delivery Charges</span>
            <span className="text-white font-bold">₹4.50</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-white/80">
            <span>Tax (GST 5%)</span>
            <span className="text-white font-bold">₹0.00</span>
          </div>
        </div>

        <div className="flex justify-between items-center py-5 border-t border-b border-white/10 mb-8">
          <p className="text-sm font-medium text-white/90 leading-tight">Total<br />Amount</p>
          <div className="bg-white rounded-xl py-3.5 px-6 flex items-center justify-center shadow-inner">
            <span className="text-3xl font-extrabold text-[#3A6447] tracking-tight">₹{total}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 text-[10px] font-bold text-white/90 uppercase tracking-widest pt-2">
          <CreditCard size={14} />
          {status.toUpperCase()} VIA {method.toUpperCase()}
        </div>
      </div>

      {/* 3. Wellness Tip Card */}
      <div className="bg-[#FDF9EE] text-black rounded-[24px] p-6 shadow-lg border-[#EFEBE1]">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={20} className="text-[#A67C00]" />
          <h3 className="text-base font-bold text-gray-900">Wellness Tip</h3>
        </div>
        <p className="text-sm text-gray-700 font-medium leading-relaxed">
          Consume herbal supplements with warm water to increase absorption and aid digestion.
        </p>
      </div>

    </div>
  );
};

export default OrderInfoSidePanel;