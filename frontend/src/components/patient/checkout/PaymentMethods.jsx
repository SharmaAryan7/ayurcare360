import React from 'react';
import { CreditCard, Wallet, Truck } from 'lucide-react';

const PaymentMethods = ({ selectedPayment, setSelectedPayment, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-16 bg-gray-100 rounded-2xl w-full"></div>
                    ))}
                </div>
            </div>
        );
    }

    const methods = [
        { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
        { id: 'wallet', label: 'UPI / Wallets', icon: Wallet },
        { id: 'cod', label: 'Cash on Delivery', icon: Truck },
    ];

    return (
        <div className="bg-white rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Method</h2>

            <div className="space-y-4">
                {methods.map((method) => {
                    const Icon = method.icon;
                    const isSelected = selectedPayment === method.id;

                    return (
                        <div
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                                    ? 'border-[#4A7C59] bg-[#E7F3EB]/30'
                                    : 'border-[#EFEBE1] hover:border-[#D1CFC8] hover:bg-gray-50'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${isSelected ? 'border-[#4A7C59]' : 'border-gray-300'
                                }`}>
                                {isSelected && <div className="w-2.5 h-2.5 bg-[#4A7C59] rounded-full"></div>}
                            </div>
                            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white text-[#4A7C59] shadow-sm' : 'bg-gray-100 text-gray-500'}`}>
                                <Icon size={18} />
                            </div>
                            <span className="font-bold text-sm text-gray-900">{method.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PaymentMethods;