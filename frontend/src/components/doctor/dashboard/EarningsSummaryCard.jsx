import React from 'react';

const EarningsSummaryCard = ({ earnings }) => {
    return (
        // THE FIX: Changed h-4/5 to h-full, and increased padding to p-8 for better breathing room
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-[#EFEBE1] h-full flex flex-col justify-between">

            <div>
                <div className="mb-8">
                    <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Earnings Summary</h3>
                </div>

                <div className="mb-8">
                    <p className="text-[11px] text-gray-500 font-extrabold tracking-widest uppercase mb-2">Total Earnings</p>
                    <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                        ₹{Number(earnings?.total || 0).toLocaleString()}
                    </h2>
                </div>
            </div>

            {/* THE FIX: Pushed to the bottom using Flexbox naturally */}
            <div className="pt-6 border-t border-[#EFEBE1]">
                <p className="text-[11px] text-gray-500 font-extrabold tracking-widest uppercase mb-2">Monthly Earnings</p>
                <h2 className="text-3xl font-extrabold text-[#3A6447] tracking-tight">
                    ₹{Number(earnings?.monthly || 0).toLocaleString()}
                </h2>
            </div>

        </div>
    );
};

export default EarningsSummaryCard;