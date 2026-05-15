import React from 'react';
import { Leaf } from 'lucide-react';

const IngredientsList = ({ ingredients, isLoading }) => {
    if (isLoading) {
        return (
            <div className="lg:col-span-1 bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm animate-pulse h-64">
                <div className="h-6 bg-gray-200 rounded w-40 mb-6"></div>
                <div className="space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                    <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
            </div>
        );
    }

    const safeIngredients = Array.isArray(ingredients) && ingredients.length > 0 ? ingredients : [
        { name: 'Proprietary Herbal Blend', percentage: '100%' }
    ];

    return (
        <div className="lg:col-span-1 bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <div className="p-2 bg-white text-[#8B6A47] rounded-xl shadow-sm"><Leaf size={20} /></div>
                Key Ingredients
            </h3>

            <ul className="space-y-4">
                {safeIngredients.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center pb-4 border-b border-[#EFEBE1] last:border-0 last:pb-0">
                        <span className="text-sm font-bold text-gray-800">{item.name || item}</span>
                        {item.percentage && (
                            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest bg-white px-2 py-1 rounded-md shadow-sm">
                                {item.percentage}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default IngredientsList;