import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Leaf, Loader2 } from 'lucide-react';
import { ecommerceApi } from '../../api/ecommerceApi';
import { patientApi } from '../../api/patientApi';
import { useCart } from '../../context/CartContext';

import BillingForm from '../../components/patient/checkout/BillingForm';
import PaymentMethods from '../../components/patient/checkout/PaymentMethods';
import CheckoutSummary from '../../components/patient/checkout/CheckoutSummary';

/**
 * Dynamically loads the Razorpay checkout script.
 */
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            return resolve(true);
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const CheckoutPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { cartItems, cartTotal, clearCart } = useCart();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState('card');

    const [formData, setFormData] = useState({
        fullName: '', email: '', mobile: '', address: '', city: '', postalCode: ''
    });

    const tax = cartItems.length > 0 ? 5.0 : 0;
    const total = cartTotal + tax;

    // Route Guard: Prevent direct URL access bypassing the standard cart flow
    if (!location.state || !location.state.fromCart) {
        return <Navigate to="/patient/cart" replace />;
    }

    // Route Guard: Prevent checkout processes with an empty cart
    if (cartItems.length === 0) {
        return <Navigate to="/patient/pharmacy-store" replace />;
    }

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const [personalRes, contactRes] = await Promise.all([
                    patientApi.getProfilePersonal(),
                    patientApi.getProfileContact()
                ]);
                const personal = personalRes.profile || personalRes || {};
                const contact = contactRes.profile || contactRes || {};

                setFormData({
                    fullName: personal.full_name || personal.name || personal.fullName || '',
                    email: contact.email || contact.email_address || '',
                    mobile: contact.phone || contact.phone_number || contact.mobile || '',
                    address: '',
                    city: '',
                    postalCode: ''
                });
            } catch (error) {
                console.error('Failed to load profile details', error);
            } finally {
                setIsLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePayNow = async () => {
        const { address, city, postalCode } = formData;
        if (!address?.trim() || !city?.trim() || !postalCode?.trim()) {
            alert("Please fill in all mandatory address fields (Street Address, City, and Postal Code) before paying.");
            return;
        }

        setIsSubmitting(true);

        const orderPayload = {
            items: cartItems.map(item => ({ product_id: item.id, quantity: item.quantity, price: item.price })),
            total_amount: total,
            shipping_address: `${address.trim()}, ${city.trim()} - ${postalCode.trim()}`,
            payment_method: selectedPayment === 'cod' ? 'Cash' : 'Online'
        };

        try {
            if (selectedPayment === 'cod') {
                await ecommerceApi.createOrder(orderPayload);
                clearCart();
                navigate('/patient/pharmacy-orders', { state: { success: true }, replace: true });
                return;
            }

            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setIsSubmitting(false);
                return;
            }

            const orderData = await ecommerceApi.createOrder(orderPayload);

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: orderData.currency || "INR",
                name: "AyurCure",
                description: "Pharmacy Order Payment",
                order_id: orderData.razorpay_order_id,
                handler: async function (response) {
                    try {
                        await ecommerceApi.verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: orderData.id
                        });
                        clearCart();
                        navigate('/patient/pharmacy-orders', { state: { success: true }, replace: true });
                    } catch (err) {
                        console.error(err);
                        alert("Payment verification failed! Please contact support if amount was deducted.");
                        setIsSubmitting(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.mobile
                },
                theme: {
                    color: "#52735B"
                },
                modal: {
                    ondismiss: function () {
                        setIsSubmitting(false);
                    }
                }
            };

            const paymentObject = new window.Razorpay(options);

            paymentObject.on('payment.failed', function (response) {
                console.error("Payment Failed:", response.error);
                alert(`Payment Failed: ${response.error.description}`);
                setIsSubmitting(false);
            });

            paymentObject.open();

        } catch (error) {
            console.error('Checkout error:', error);
            alert('Failed to process checkout. Please try again.');
            setIsSubmitting(false);
        }
    };

    if (isLoadingProfile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#FDF9EE]">
                <Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FDF9EE] p-4 md:p-8 font-sans pb-24">
            <div className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Billing Details</h1>
                <p className="text-gray-600 text-sm md:text-base">Complete your pharmacy order with secure checkout.</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="flex-1 flex flex-col gap-6">
                    <BillingForm formData={formData} handleInputChange={handleInputChange} />
                    <PaymentMethods selectedPayment={selectedPayment} setSelectedPayment={setSelectedPayment} />
                </div>

                <div className="w-full lg:w-[380px] xl:w-[420px] shrink-0 flex flex-col gap-6">
                    <CheckoutSummary subtotal={cartTotal} tax={tax} total={total} onPayNow={handlePayNow} isSubmitting={isSubmitting} />

                    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4 items-start">
                        <div className="bg-[#E8F0E9] p-2 rounded-full text-[#4A7C59] shrink-0"><Leaf size={18} /></div>
                        <div>
                            <h4 className="text-sm font-bold text-[#37822e] mb-1">Eco-Friendly Delivery</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">Your medicines will be delivered in biodegradable packaging.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;