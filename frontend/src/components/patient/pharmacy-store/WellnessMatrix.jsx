import React from 'react';
import { Sparkles, Activity, ShieldCheck } from 'lucide-react';

const WellnessMatrix = ({ benefits, isLoading }) => {
    if (isLoading) {
        return (
            <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-64">
                <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="h-16 bg-gray-100 rounded-2xl w-full"></div>
                    <div className="h-16 bg-gray-100 rounded-2xl w-full"></div>
                </div>
            </div>
        );
    }

    const safeBenefits = Array.isArray(benefits) && benefits.length > 0 ? benefits : [
        { icon: ShieldCheck, title: 'Immunity Support', desc: 'Strengthens natural defenses' },
        { icon: Activity, title: 'Energy Balance', desc: 'Restores vitality and vigor' }
    ];

    return (
        <div className="lg:col-span-2 bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2 bg-[#E7F3EB] text-[#4A7C59] rounded-xl"><Sparkles size={20} /></div>
                Therapeutic Indications
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {safeBenefits.map((benefit, idx) => {
                    const IconComponent = typeof benefit.icon === 'function' ? benefit.icon : Sparkles;
                    return (
                        <div key={idx} className="flex gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50">
                            <div className="text-[#8B6A47] shrink-0">
                                <IconComponent size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{benefit.title || 'Wellness Benefit'}</h4>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">{benefit.desc || benefit}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default WellnessMatrix;