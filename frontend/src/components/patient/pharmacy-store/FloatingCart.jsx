import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Added cartCount to the destructured props
const FloatingCart = ({ cartTotal, cartCount }) => {
    const navigate = useNavigate();

    // Do not render the cart widget if the cart is empty
    if (cartCount === 0) return null;

    return (
        <div className="fixed bottom-8 right-8 bg-[#1E231E] text-white rounded-2xl p-3 shadow-2xl flex items-center gap-5 border border-gray-700 animate-fade-in-up z-50 hover:scale-105 transition-transform">

            {/* Clickable area to view the Cart Summary page */}
            <div
                className="flex items-center gap-3 pl-2 cursor-pointer"
                onClick={() => navigate('/patient/cart')}
                title="View Cart"
            >
                <div className="relative">
                    <ShoppingCart className="w-5 h-5 text-gray-300" />
                    {/* Replaced static '2' with dynamic {cartCount} */}
                    <span className="absolute -top-2 -right-2 bg-[#2D5A27] text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                        {cartCount}
                    </span>
                </div>
                <div>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wider mb-0.5">YOUR CART</p>
                    <p className="font-bold text-sm leading-none">₹{cartTotal.toFixed(2)}</p>
                </div>
            </div>

            {/* Direct Checkout Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the cart navigation above
                    navigate('/patient/checkout');
                }}
                className="bg-[#2D5A27] hover:bg-[#1E4620] px-5 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
                Checkout
            </button>

        </div>
    );
};

export default FloatingCart;