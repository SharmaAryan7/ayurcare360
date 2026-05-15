import React from 'react';
import { ArrowRight, Tag } from 'lucide-react';

const OrderSummaryPanel = ({ subtotal, taxes, total, isLoading, onCheckout }) => {

    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-[400px]">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="space-y-4 mb-6">
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                    <div className="h-4 bg-gray-100 rounded w-full"></div>
                </div>
                <div className="pt-6 border-t border-[#EFEBE1] mb-8">
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
                <div className="h-14 bg-gray-200 rounded-2xl w-full"></div>
            </div>
        );
    }

    const safeSubtotal = parseFloat(subtotal) || 0;
    const safeTaxes = parseFloat(taxes) || 0;
    const safeTotal = parseFloat(total) || 0;

    return (
        <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>

            <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Subtotal</span>
                    <span className="text-gray-900 font-bold">₹{safeSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Estimated Tax</span>
                    <span className="text-gray-900 font-bold">₹{safeTaxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                    <span>Shipping</span>
                    <span className="text-[#4A7C59] font-bold">Calculated at checkout</span>
                </div>
            </div>

            <div className="mb-6 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Tag size={16} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    placeholder="Promo Code"
                    className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#4A7C59] transition-all uppercase shadow-inner"
                />
                <button className="absolute inset-y-1 right-1 px-4 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm">
                    APPLY
                </button>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-[#EFEBE1] mb-8">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-extrabold text-gray-900">₹{safeTotal.toFixed(2)}</span>
            </div>

            <button
                onClick={onCheckout}
                disabled={safeTotal <= 0}
                className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors ${safeTotal > 0
                    ? 'bg-[#3A6447] hover:bg-[#2C4D36] text-white'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
            >
                Proceed to Checkout <ArrowRight size={18} />
            </button>

            <p className="text-[10px] text-gray-400 text-center mt-4 px-4 leading-relaxed">
                Secure checkout powered by AyurCure. Shipping & taxes calculated at the next step.
            </p>
        </div>
    );
};

export default OrderSummaryPanel;