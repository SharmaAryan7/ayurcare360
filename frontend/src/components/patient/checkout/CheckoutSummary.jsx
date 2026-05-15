import React from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

const CheckoutSummary = ({ subtotal, tax, total, onPayNow, isSubmitting, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm sticky top-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4 mb-6">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
                <div className="pt-5 border-t border-[#EFEBE1] mb-8">
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-14 bg-gray-200 rounded-2xl w-full"></div>
            </div>
        );
    }

    const safeSubtotal = parseFloat(subtotal) || 0;
    const safeTax = parseFloat(tax) || 0;
    const safeTotal = parseFloat(total) || 0;

    return (
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Cart Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{safeSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Shipping & Handling</span>
                    <span className="text-[#4A7C59] font-bold">Free</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="text-gray-900 font-bold">₹{safeTax.toFixed(2)}</span>
                </div>
            </div>

            <div className="flex justify-between items-center pt-5 border-t border-[#EFEBE1] mb-8">
                <span className="text-base font-bold text-gray-900">Total to Pay</span>
                <span className="text-2xl font-extrabold text-gray-900">₹{safeTotal.toFixed(2)}</span>
            </div>

            <button
                onClick={onPayNow}
                disabled={isSubmitting || safeTotal === 0}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors ${isSubmitting || safeTotal === 0
                        ? 'bg-gray-400 cursor-not-allowed text-white'
                        : 'bg-[#3A6447] hover:bg-[#2C4D36] text-white'
                    }`}
            >
                {isSubmitting ? (
                    <><Loader2 size={18} className="animate-spin" /> Processing...</>
                ) : (
                    <><ShieldCheck size={18} /> Pay Securely</>
                )}
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-4 px-2 leading-relaxed">
                By placing your order, you agree to our Terms of Service and Privacy Policy. All payments are encrypted.
            </p>
        </div>
    );
};

export default CheckoutSummary;