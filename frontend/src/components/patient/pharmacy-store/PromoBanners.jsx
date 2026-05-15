import React from 'react';

const PromoBanners = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#2D5A27] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-md">
                <div className="relative z-10 max-w-sm">
                    <span className="text-xs font-bold tracking-wider text-black bg-[#9a6f2d] mb-2 block w-fit rounded-full px-2 py-1">PROMOTIONAL OFFER</span>
                    <h2 className="text-3xl font-bold mb-3">Reclaim Your Inner Harmony</h2>
                    <p className="text-[#E8E3D8] text-sm mb-6">Get 20% off on all Immunity Boosters and Herbal Supplements this week.</p>
                    <button className="bg-[#2e8633] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-opacity-90 w-max border border-white/10 transition-colors">
                        Shop Immunity
                    </button>
                </div>
                {/* Abstract UI shapes mimicking the design */}
                <div className="absolute right-0 bottom-0 w-64 h-64 bg-white opacity-5 rounded-full transform translate-x-1/4 translate-y-1/4"></div>
                <div className="absolute right-20 top-0 w-32 h-32 bg-black opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="bg-[#F3EFE6] rounded-3xl p-8 flex flex-col justify-center border border-[#E8E3D8] hover:shadow-md transition-shadow cursor-pointer">
                <div className="bg-[#2D5A27] w-12 h-12 rounded-xl flex items-center justify-center mb-5 shadow-sm">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Free Wellness Guide</h3>
                <p className="text-gray-600 text-sm mb-5">Download our expert-curated guide on seasonal Ayurvedic routines for optimal health.</p>
                <button className="text-[#2D5A27] font-semibold text-sm flex items-center gap-1 hover:text-[#1E4620] transition-colors">
                    Download Now <span className="text-lg leading-none">→</span>
                </button>
            </div>
        </div>
    );
};

export default PromoBanners;