import React from 'react';
import { Leaf } from 'lucide-react';
import CartItem from '../../components/patient/cart/CartItem';
import OrderSummaryPanel from '../../components/patient/cart/OrderSummaryPanel';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartSummary = () => {
    // Pulling strictly dynamic data from the Context Provider
    const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
    const navigate = useNavigate();

    // Dynamic tax calculation (e.g., 5% of the total, or 0 if cart is empty)
    const taxes = cartItems.length > 0 ? (cartTotal * 0.05) : 0;
    const total = cartTotal + taxes;

    // Pass the strict flow state key to securely enter the checkout page
    const handleProceedToCheckout = () => {
        navigate('/patient/checkout', { state: { fromCart: true } });
    };

    return (
        <div className="min-h-screen bg-[#FDF9EE] p-4 md:p-8 font-sans pb-24">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Cart Summary</h1>
                <p className="text-gray-600 text-sm md:text-base">
                    Review your selection for a holistic wellness journey.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1">
                    {cartItems && cartItems.length > 0 ? (
                        <div className="bg-[#fdf7e7] rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6">
                            {cartItems.map(item => (
                                <CartItem
                                    key={item.id || item._id}
                                    item={item}
                                    updateQuantity={updateQuantity}
                                    removeItem={removeFromCart}
                                />
                            ))}

                            <div className="mt-8 bg-[#FDFBF7] border border-[#E8E3D8] rounded-2xl p-4 flex items-start sm:items-center gap-3">
                                <div className="bg-[#8B6A47]/10 p-2 rounded-full text-[#8B6A47] shrink-0">
                                    <Leaf size={16} />
                                </div>
                                <p className="text-sm text-gray-700">
                                    Add more items to unlock our <span className="font-bold">Free Herbal Tea Sampler</span>!
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center">
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-500">Add some holistic products from the Pharmacy to begin your wellness journey.</p>
                        </div>
                    )}
                </div>

                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0">
                    <OrderSummaryPanel
                        subtotal={cartTotal}
                        taxes={taxes}
                        total={total}
                        onCheckout={handleProceedToCheckout}
                    />
                </div>
            </div>
        </div>
    );
};

export default CartSummary;