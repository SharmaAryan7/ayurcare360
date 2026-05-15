import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles, CheckCircle2, Loader2 } from 'lucide-react';
import { ecommerceApi } from '../../api/ecommerceApi';
import { useCart } from '../../context/CartContext';

import ProductBreadcrumb from '../../components/patient/pharmacy-store/ProductBreadcrumb';
import ProductGallery from '../../components/patient/pharmacy-store/ProductGallery';
import ProductInfo from '../../components/patient/pharmacy-store/ProductInfo';
import WellnessMatrix from '../../components/patient/pharmacy-store/WellnessMatrix';
import IngredientsList from '../../components/patient/pharmacy-store/IngredientsList';
import FloatingCart from '../../components/patient/pharmacy-store/FloatingCart';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { addToCart, cartTotal, cartCount } = useCart();
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                setLoading(true);
                const data = await ecommerceApi.getProductDetails(id);
                if (data && data.product) {
                    const dbProduct = data.product;

                    // Data Mapping for PostgreSQL to UI Component format
                    const mappedProduct = {
                        ...dbProduct,
                        images: dbProduct.image_url ? [dbProduct.image_url] : [],
                        ingredients: typeof dbProduct.key_ingredients === 'string'
                            ? [{ name: dbProduct.key_ingredients, percentage: 'Active' }]
                            : (dbProduct.key_ingredients || []),
                        benefits: typeof dbProduct.therapeutic_indications === 'string'
                            ? [{ icon: Sparkles, title: 'Health Benefit', desc: dbProduct.therapeutic_indications }]
                            : (dbProduct.therapeutic_indications || [])
                    };

                    setProduct(mappedProduct);
                } else {
                    setError("Product details not available.");
                }
            } catch (error) {
                console.error("Failed to fetch product details", error);
                setError("Failed to load the product.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProductDetails();
    }, [id]);

    const handleAddToCart = (productVariant, quantity = 1) => {
        addToCart(productVariant, quantity);
        setToast({ show: true, message: 'Added to cart successfully!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-full min-h-screen bg-[#FDFBF7]"><Loader2 className="animate-spin text-[#2D5A27] w-12 h-12" /></div>;
    }

    if (error || !product) {
        return <div className="p-10 text-center font-bold text-red-500 bg-[#FDFBF7] min-h-screen">{error || "Product not found."}</div>;
    }

    return (
        <div className="min-h-screen p-4 md:p-8 font-sans pb-24 relative bg-[#FDFBF7]">
            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[60] animate-fade-in">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <span className="text-sm font-medium tracking-wide">{toast.message}</span>
                </div>
            )}

            <ProductBreadcrumb />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                <ProductGallery images={product.images} name={product.name} />
                <ProductInfo product={product} onAddToCart={handleAddToCart} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <WellnessMatrix benefits={product.benefits} />
                <IngredientsList ingredients={product.ingredients} />
            </div>

            <FloatingCart cartTotal={cartTotal} cartCount={cartCount} />
        </div>
    );
};

export default ProductDetails;