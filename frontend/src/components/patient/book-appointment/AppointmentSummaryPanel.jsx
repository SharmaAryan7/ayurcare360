import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react'; // Changed CheckCircle2 to ShieldCheck for payments

const AppointmentSummaryPanel = ({ fee, tax, onConfirm, isSubmitting, isLoading }) => {
  if (isLoading) {
    return (
      <>
        <div className="h-3 bg-gray-200 rounded w-40 mb-5 animate-pulse"></div>
        <div className="space-y-4 mb-6 animate-pulse">
          <div className="h-4 bg-gray-100 rounded w-full"></div>
          <div className="h-4 bg-gray-100 rounded w-full"></div>
        </div>
        <div className="pt-6 border-t border-[#EFEBE1] mb-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="w-full bg-gray-200 py-7 rounded-2xl animate-pulse"></div>
      </>
    );
  }

  const baseFee = parseFloat(fee) || 0;
  const taxFee = parseFloat(tax) || 0;
  const total = (baseFee + taxFee).toFixed(2);

  return (
    <>
      <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Appointment Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span>Consultation</span>
          <span className="text-gray-900 font-bold">₹{baseFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium text-gray-600">
          <span>Tax & Fees</span>
          <span className="text-gray-900 font-bold">₹{taxFee.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-[#EFEBE1] mb-8">
        <span className="text-base font-bold text-gray-900">Total Amount</span>
        <span className="text-2xl font-extrabold text-gray-900">₹{total}</span>
      </div>

      <button
        onClick={onConfirm}
        disabled={isSubmitting}
        className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors ${isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3A6447] hover:bg-[#2C4D36]'
          }`}
      >
        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
        {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
      </button>
      <p className="text-[10px] text-gray-400 text-center mt-4 px-4 leading-relaxed">
        Secure checkout. You will be redirected to the payment gateway.
      </p>
    </>
  );
};

export default AppointmentSummaryPanel;