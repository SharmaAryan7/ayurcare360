import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductBreadcrumb = ({ category, productName, isLoading }) => {
    if (isLoading) {
        return <div className="h-4 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>;
    }

    return (
        <div className="flex items-center text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-8">
            <Link to="/patient/pharmacy-store" className="hover:text-[#4A7C59] transition-colors">Store</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/patient/pharmacy-store" className="hover:text-[#4A7C59] transition-colors">{category || 'Products'}</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900 truncate max-w-[200px] sm:max-w-xs">{productName || 'Details'}</span>
        </div>
    );
};

export default ProductBreadcrumb;