import React from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, quantity, onAddToCart, onUpdateQuantity, isLoading }) => {
    const navigate = useNavigate();

    if (isLoading) {
        return (
            <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 border border-[#EFEBE1] shadow-sm animate-pulse h-[340px] sm:h-[380px] flex flex-col justify-between">
                <div className="h-40 sm:h-48 bg-gray-100 rounded-xl sm:rounded-2xl mb-4 w-full"></div>
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
                <div className="flex justify-between items-center mt-4 border-t border-gray-100 pt-4">
                    <div className="h-5 sm:h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 w-8 sm:h-10 sm:w-10 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    const safeProduct = product || {};
    const price = parseFloat(safeProduct.price || safeProduct.price_at_purchase || 0).toFixed(2);
    const imageUrl = safeProduct.image || safeProduct.image_url;

    return (
        <div className="bg-white rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 border border-[#EFEBE1] shadow-sm hover:shadow-md hover:border-[#D1CFC8] transition-all flex flex-col h-full group">

            <div
                className="bg-[#FDF9EE] rounded-xl sm:rounded-2xl h-40 sm:h-48 mb-4 sm:mb-5 flex items-center justify-center p-3 sm:p-4 relative overflow-hidden cursor-pointer"
                // FIXED NAVIGATE URL HERE: Removed '/product' to match App.jsx route
                onClick={() => navigate(`/patient/pharmacy-store/${safeProduct.id || safeProduct._id}`)}
            >
                {safeProduct.tag && (
                    <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-white/80 backdrop-blur-sm px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold text-[#A67C00] uppercase tracking-widest border border-white">
                        {safeProduct.tag}
                    </span>
                )}
                {imageUrl ? (
                    <img src={imageUrl} alt={safeProduct.name} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                ) : (
                    <div className="text-3xl sm:text-4xl text-[#3A6447] font-bold opacity-30">
                        {safeProduct.name?.charAt(0) || 'P'}
                    </div>
                )}
            </div>

            <div
                className="flex-1 cursor-pointer"
                // FIXED NAVIGATE URL HERE TOO
                onClick={() => navigate(`/patient/pharmacy-store/${safeProduct.id || safeProduct._id}`)}
            >
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-2">{safeProduct.name}</h3>
                <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-3 sm:mb-4 line-clamp-2">
                    {safeProduct.description || safeProduct.category || 'Authentic formulation.'}
                </p>
            </div>

            <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-[#EFEBE1] mt-auto">
                <span className="text-lg sm:text-xl font-extrabold text-[#3A6447]">₹{price}</span>

                {quantity > 0 ? (
                    <div className="flex items-center bg-gray-50 rounded-full p-1 border border-[#EFEBE1]">
                        <button
                            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(safeProduct.id || safeProduct._id, quantity - 1); }}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition-colors shadow-sm"
                        >
                            <Minus size={14} />
                        </button>
                        <span className="w-5 sm:w-6 text-center text-xs sm:text-sm font-bold text-gray-900">{quantity}</span>
                        <button
                            onClick={(e) => { e.stopPropagation(); onUpdateQuantity(safeProduct.id || safeProduct._id, quantity + 1); }}
                            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-white rounded-full transition-colors shadow-sm"
                        >
                            <Plus size={14} />
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={(e) => { e.stopPropagation(); onAddToCart(safeProduct); }}
                        className="w-8 h-8 sm:w-10 sm:h-10 bg-[#3A6447] hover:bg-[#2C4D36] text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
                    >
                        <ShoppingCart size={14} className="sm:w-4 sm:h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProductCard;