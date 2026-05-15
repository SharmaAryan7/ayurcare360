import React from 'react';

const OrderedProductsCard = ({ products, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-8"></div>
        <div className="space-y-6">
          {[1, 2].map(i => (
            <div key={i} className="flex gap-4 pb-6 border-b border-gray-200">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl shrink-0"></div>
              <div className="flex-1 space-y-2 py-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-16 mt-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-8">Ordered Products</h3>

      <div className="space-y-6">
        {safeProducts.length > 0 ? (
          safeProducts.map((product, index) => {
            const price = parseFloat(product.price_at_purchase || product.price || 0).toFixed(2);

            return (
              <div key={index} className="flex items-center gap-4 pb-6 border-b border-[#EFEBE1] last:border-0 last:pb-0">

                <div className="w-20 h-20 rounded-2xl bg-[#FDF9EE] border border-[#EFEBE1] flex items-center justify-center shrink-0 overflow-hidden">
                  {product.image_url || product.image ? (
                    <img src={product.image_url || product.image} alt={product.name} className="w-full h-full object-contain p-2" />
                  ) : (
                    <div className="text-2xl text-[#4A7C59] font-bold">{product.name?.charAt(0) || 'P'}</div>
                  )}
                </div>

                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900 leading-tight">{product.name || 'Wellness Product'}</h4>
                  <p className="text-sm font-semibold text-[#9333EA] mt-1">{product.variant || product.category || 'Standard Pack'}</p>
                  <p className="text-xs font-medium text-gray-500 mt-2">
                    <span className='font-bold text-gray-900'>Qty: {product.quantity || 1}</span> • SKU: {product.sku || `PRD-${product.product_id}`}
                  </p>
                </div>

                <div className="text-right flex flex-col items-end">
                  <p className="text-xl font-extrabold text-[#3A6447]">₹{price}</p>
                  {product.originalPrice && (
                    <p className="text-xs font-medium text-gray-400 line-through mt-0.5">₹{product.originalPrice}</p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500 font-medium">
            No product details available for this order.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderedProductsCard;