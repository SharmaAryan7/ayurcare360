import React from 'react';
import { DollarSign, Wallet } from 'lucide-react';

const EarningsSummary = ({ stats }) => {
    // Default safe values
    const safeStats = stats || { totalEarnings: 0, monthlyEarnings: 0 };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

            {/* Total Earnings Card */}
            <div className="bg-white rounded-3xl px-12 shadow-sm border border-gray-100 flex flex-col justify-center h-48 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl text-green-600 bg-green-50">
                        <DollarSign size={20} />
                    </div>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Total Earnings</p>
                </div>

                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                    ₹{Number(safeStats.totalEarnings).toLocaleString()}
                </h2>
                <p className="text-gray-400 text-sm font-medium tracking-wide">All-time total generated revenue</p>
            </div>

            {/* Monthly Earnings Card */}
            <div className="bg-white rounded-3xl px-12 shadow-sm border border-gray-100 flex flex-col justify-center h-48 transition-transform hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3.5 rounded-2xl text-blue-600 bg-blue-50">
                        <Wallet size={20} />
                    </div>
                    <p className="text-sm text-gray-500 font-bold tracking-widest uppercase">Monthly Earnings</p>
                </div>

                <h2 className="text-4xl font-black text-gray-900 tracking-tight mb-2">
                    ₹{Number(safeStats.monthlyEarnings).toLocaleString()}
                </h2>
                <p className="text-gray-400 text-sm font-medium tracking-wide">Revenue generated this month</p>
            </div>

        </div>
    );
};

export default EarningsSummary;