import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartItem = ({ item, updateQuantity, removeItem, isLoading }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col sm:flex-row gap-6 py-6 border-b border-[#EFEBE1] last:border-0 animate-pulse">
                <div className="w-24 h-24 bg-gray-200 rounded-2xl shrink-0"></div>
                <div className="flex-1 flex flex-col justify-between">
                    <div>
                        <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-100 rounded w-1/2 mb-4"></div>
                    </div>
                    <div className="flex justify-between items-center mt-4 sm:mt-0">
                        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                </div>
            </div>
        );
    }

    const safeItem = item || {};
    const imageSrc = safeItem.image || safeItem.image_url || 'https://via.placeholder.com/150';
    const price = parseFloat(safeItem.price || safeItem.price_at_purchase || 0).toFixed(2);
    const productId = safeItem.id || safeItem._id;
    const currentQuantity = safeItem.quantity || 1;

    return (
        <div className="flex flex-col sm:flex-row gap-6 py-6 border-b border-[#E8E3D8] last:border-0 hover:bg-[#FDF9EE]/50 transition-colors rounded-2xl px-2">
            <div className="w-24 h-24 bg-white rounded-2xl border border-[#E8E3D8] p-2 shrink-0 overflow-hidden shadow-sm">
                <img src={imageSrc} alt={safeItem.name} className="w-full h-full object-cover rounded-xl" />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row justify-between">
                <div className="mb-4 sm:mb-0 pr-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{safeItem.name || 'Unknown Product'}</h3>
                    <p className="text-sm font-medium text-gray-500">{safeItem.description || safeItem.category || 'Wellness Product'}</p>
                </div>

                <div className="flex sm:flex-col justify-between items-end gap-4">
                    <span className="text-xl font-extrabold text-gray-900">₹{price}</span>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-white border border-[#E8E3D8] rounded-full p-1 shadow-sm">
                            <button
                                onClick={() => updateQuantity(productId, Math.max(1, currentQuantity - 1))}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-gray-900">
                                {currentQuantity}
                            </span>
                            <button
                                onClick={() => updateQuantity(productId, currentQuantity + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-colors"
                            >
                                <Plus size={14} />
                            </button>
                        </div>
                        <button
                            onClick={() => removeItem(productId)}
                            className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors shadow-sm border border-red-100"
                            title="Remove Item"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;