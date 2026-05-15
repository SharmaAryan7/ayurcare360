import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';

const ProductInfo = ({ product, onAddToCart, isLoading }) => {
    const [quantity, setQuantity] = useState(1);

    if (isLoading) {
        return (
            <div className="flex flex-col animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-10 bg-gray-200 rounded w-32 mb-6"></div>
                <div className="h-24 bg-gray-100 rounded-2xl w-full mb-8"></div>
                <div className="h-14 bg-gray-200 rounded-full w-full"></div>
            </div>
        );
    }

    const safeProduct = product || {};
    const price = parseFloat(safeProduct.price || safeProduct.price_at_purchase || 0).toFixed(2);

    return (
        <div className="flex flex-col">
            <span className="text-[10px] font-extrabold text-[#A67C00] bg-[#FEF5D3] px-3 py-1 rounded-full w-fit uppercase tracking-widest mb-4 border border-[#F5E6CC]">
                {safeProduct.tag || safeProduct.category || 'Wellness'}
            </span>

            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{safeProduct.name}</h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">SKU: {safeProduct.sku || 'PRD-10293'}</p>

            <div className="flex items-end gap-4 mb-8">
                <span className="text-4xl font-extrabold text-[#3A6447]">₹{price}</span>
            </div>

            <p className="text-base text-gray-600 leading-relaxed font-medium mb-8">
                {safeProduct.description || 'A highly effective formulation derived from ancient texts to balance your doshas and revitalize your inner energy.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center justify-between bg-white border border-[#EFEBE1] rounded-full p-2 w-full sm:w-40 shadow-sm">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <Minus size={16} />
                    </button>
                    <span className="font-bold text-lg text-gray-900">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-gray-50 rounded-full transition-colors"
                    >
                        <Plus size={16} />
                    </button>
                </div>

                <button
                    onClick={() => onAddToCart(safeProduct, quantity)}
                    className="flex-1 bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-4 px-8 rounded-full flex items-center justify-center gap-3 transition-colors shadow-md"
                >
                    <ShoppingCart size={20} /> Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;