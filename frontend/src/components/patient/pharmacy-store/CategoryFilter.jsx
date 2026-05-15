import React from 'react';

const CategoryFilter = ({ activeCategory, setActiveCategory, isLoading }) => {
    const categories = [
        'All',
        'Herbal Supplements',
        'Digestive Care',
        'Immunity Boosters',
        'Skin Care',
        'Wellness Products'
    ];

    if (isLoading) {
        return (
            <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-12 w-32 bg-gray-200 rounded-full animate-pulse shrink-0"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 hide-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-all shadow-sm ${activeCategory === cat
                            ? 'bg-[#3A6447] text-white border border-[#3A6447]'
                            : 'bg-white text-gray-600 border border-[#EFEBE1] hover:bg-gray-50'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default CategoryFilter;