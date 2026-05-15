import React from 'react';
import { ShieldCheck } from 'lucide-react';

const StoreHeader = () => {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Pharmacy Store</h1>
                <p className="text-amber-800 max-w-2xl text-sm md:text-base">
                    Discover natural healing through our curated selection of organic Ayurvedic remedies and premium wellness products.
                </p>
            </div>
            <div className="flex items-center gap-2 bg-[#F3EFE6] px-4 py-2 rounded-xl border border-[#E8E3D8]">
                <ShieldCheck className="w-5 h-5 text-[#8B6A47]" />
                <span className="text-sm font-semibold text-amber-800">
                    TRUST FACTOR<br />
                    <span className="text-xs font-normal text-gray-600">100% Organic Certified</span>
                </span>
            </div>
        </div>
    );
};

export default StoreHeader;