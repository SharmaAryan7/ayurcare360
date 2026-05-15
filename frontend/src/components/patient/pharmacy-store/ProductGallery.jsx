import React, { useState } from 'react';

const ProductGallery = ({ images, name, isLoading }) => {
    const [mainImage, setMainImage] = useState(images && images.length > 0 ? images[0] : null);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                <div className="w-full h-[400px] md:h-[500px] bg-gray-200 rounded-[32px]"></div>
                <div className="flex gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    const safeImages = Array.isArray(images) && images.length > 0 ? images : [mainImage];

    return (
        <div className="flex flex-col gap-6">
            <div className="w-full h-[400px] md:h-[500px] bg-white border border-[#EFEBE1] rounded-[32px] p-8 flex items-center justify-center shadow-sm overflow-hidden relative">
                {mainImage ? (
                    <img src={mainImage} alt={name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                ) : (
                    <div className="text-6xl text-gray-200 font-bold">{name?.charAt(0) || 'P'}</div>
                )}
            </div>

            {safeImages.length > 1 && (
                <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                    {safeImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`w-20 h-20 rounded-2xl border-2 overflow-hidden shrink-0 bg-white p-2 transition-all ${mainImage === img ? 'border-[#4A7C59] shadow-md' : 'border-[#EFEBE1] hover:border-gray-300'
                                }`}
                        >
                            <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductGallery;