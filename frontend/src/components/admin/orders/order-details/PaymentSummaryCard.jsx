import React from 'react';
import { CreditCard } from 'lucide-react';

const PaymentSummaryCard = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-[#3A6447] rounded-3xl p-8 shadow-sm text-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-white/20 rounded-lg"><CreditCard size={18} /></div>
        <h3 className="text-lg font-extrabold">Payment Info</h3>
      </div>

      <div className="space-y-4 text-sm font-medium mb-8">
        <div className="flex justify-between">
          <span className="text-white/70">Subtotal</span>
          <span>₹{Number(summary.subtotal).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Discount</span>
          <span className="text-green-300">-₹{Number(summary.discount).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-white/70">Shipping</span>
          <span>{Number(summary.shipping) === 0 ? 'Free' : `₹${Number(summary.shipping).toLocaleString()}`}</span>
        </div>
      </div>

      <div className="pt-4 border-t border-white/20 flex justify-between items-center">
        <span className="font-bold text-white/90 uppercase tracking-widest text-xs">Total Paid</span>
        <span className="text-2xl font-black">₹{Number(summary.total).toLocaleString()}</span>
      </div>

      <div className="mt-4 text-xs font-bold text-white/60 bg-black/20 py-2 px-4 rounded-xl inline-block">
        Via {summary.method}
      </div>
    </div>
  );
};
export default PaymentSummaryCard;