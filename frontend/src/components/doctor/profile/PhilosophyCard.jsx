import React from 'react';
import { Quote } from 'lucide-react';

const PhilosophyCard = ({ philosophy }) => {
    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between min-h-[420px]">
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Quote size={12} />
                    </div>
                    <h3 className="text-xl font-extrabold text-gray-900">Philosophy</h3>
                </div>
                <div className='bg-[#FDF9EE] p-6 rounded-xl'>
                    <p className="text-gray-600 italic leading-relaxed text-sm">
                        "{philosophy || 'No philosophy of care provided yet.'}"
                    </p>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                <div className="flex gap-1.5 items-end h-10">
                    <div className="w-3.5 h-6 bg-green-200 rounded-full"></div>
                    <div className="w-3.5 h-10 bg-green-300 rounded-full"></div>
                    <div className="w-3.5 h-8 bg-[#4A7C59] rounded-full"></div>
                </div>
                <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">Care Focus</span>
            </div>
        </div>
    );
};

export default PhilosophyCard;