import React, { useState, useEffect } from 'react';
import StoreHeader from '../../components/patient/pharmacy-store/StoreHeader';
import CategoryFilter from '../../components/patient/pharmacy-store/CategoryFilter';
import ProductCard from '../../components/patient/pharmacy-store/ProductCard';
import FloatingCart from '../../components/patient/pharmacy-store/FloatingCart';
import { ecommerceApi } from '../../api/ecommerceApi';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const PharmacyStore = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');

    const { cartItems, addToCart, updateQuantity, cartCount, cartTotal } = useCart();
    const [toast, setToast] = useState({ show: false, message: '' });

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            setLoading(true);
            try {
                let data = [];
                // Direct granular routing based on Category
                switch (activeCategory) {
                    case 'Herbal Supplements':
                        data = await ecommerceApi.getHerbalSupplements(); break;
                    case 'Digestive Care':
                        data = await ecommerceApi.getDigestiveCare(); break;
                    case 'Immunity Boosters':
                        data = await ecommerceApi.getImmunityBoosters(); break;
                    case 'Skin Care':
                        data = await ecommerceApi.getSkinCare(); break;
                    case 'Wellness Products':
                        data = await ecommerceApi.getWellnessProducts(); break;
                    default:
                        data = await ecommerceApi.getAllProducts(); break;
                }

                // Map the backend array to the UI properties
                const mappedProducts = (data.products || data || []).map(p => ({
                    ...p,
                    tag: p.tags,
                    image: p.image_url
                }));
                setProducts(mappedProducts);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [activeCategory]);

    const handleAddToCart = (product) => {
        addToCart(product, 1);
        setToast({ show: true, message: 'Added to cart successfully!' });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF7] p-4 md:p-8 font-sans relative pb-24">
            <StoreHeader />
            <CategoryFilter activeCategory={activeCategory} setActiveCategory={setActiveCategory} />

            {toast.show && (
                <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 z-[60] animate-fade-in">
                    <CheckCircle2 size={18} className="text-green-400" />
                    <span className="text-sm font-medium tracking-wide">{toast.message}</span>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64 mb-12">
                    <Loader2 className="animate-spin text-[#2D5A27] w-12 h-12" />
                </div>
            ) : products.length === 0 ? (
                <div className="flex justify-center items-center h-64 mb-12 text-gray-500 font-medium">
                    No products found in this category.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => {
                        const cartItem = cartItems.find(item => item.id === product.id);
                        return (
                            <ProductCard
                                key={product.id}
                                product={product}
                                quantity={cartItem ? cartItem.quantity : 0}
                                onAddToCart={handleAddToCart}
                                onUpdateQuantity={updateQuantity}
                            />
                        );
                    })}
                </div>
            )}

            <FloatingCart cartTotal={cartTotal} cartCount={cartCount} />
        </div>
    );
};

export default PharmacyStore;