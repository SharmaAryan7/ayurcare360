import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, ChevronLeft, Loader2, AlertCircle } from 'lucide-react';
import AppointmentSuccessModal from '../../components/patient/book-appointment/AppointmentSuccessModal';
import { appointmentApi } from '../../api/appointmentApi';

const ConsultationPaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [paymentData, setPaymentData] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState(null);

    // STRICT ROUTING PROTECTION
    useEffect(() => {
        // 1. Block direct access, refresh, or missing data
        if (!location.state || !location.state.bookingData) {
            navigate('/patient/book-appointment', { replace: true });
            return;
        }

        setPaymentData(location.state);

        // 2. Prevent browser 'Back' button abuse
        const handlePopState = () => {
            navigate('/patient/book-appointment', { replace: true });
        };
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', handlePopState);

        return () => window.removeEventListener('popstate', handlePopState);
    }, [location.state, navigate]);

    // LOAD RAZORPAY SDK
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayNow = async () => {
        setIsProcessing(true);
        const res = await loadRazorpay();

        if (!res) {
            alert('Razorpay SDK failed to load. Please check your internet connection.');
            setIsProcessing(false);
            return;
        }

        const { bookingData, financials } = paymentData;

        // Razorpay Options
        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_TEST_KEY', // Use your actual Razorpay Key
            amount: Math.round(parseFloat(financials.total) * 100), // Amount in paise
            currency: 'INR',
            name: 'AyurCure Consultation',
            description: `Appointment with ${bookingData.doctorName}`,
            image: '/Favicon_up.png',
            handler: async function (response) {
                try {
                    // PAYMENT SUCCESSFUL: Save to Database
                    const payload = {
                        doctorId: bookingData.doctorId,
                        date: bookingData.date,
                        time: bookingData.time,
                        reason: bookingData.reason,
                        paymentId: response.razorpay_payment_id
                    };

                    await appointmentApi.createAppointment(payload);

                    setIsProcessing(false);
                    setPaymentStatus('success');

                    // Clear the history state to completely invalidate the current page
                    window.history.replaceState({}, document.title);
                } catch (error) {
                    console.error("Appointment creation failed post-payment", error);
                    alert("Payment succeeded but appointment creation failed. Please contact support.");
                    setIsProcessing(false);
                }
            },
            prefill: {
                name: "Patient", // Optional: pre-fill with patient details if available in context
            },
            theme: { color: '#4A7C59' },
            modal: {
                ondismiss: function () {
                    setIsProcessing(false);
                }
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    };

    const handleCancelPayment = () => {
        setPaymentStatus('cancelled');
    };

    if (!paymentData) {
        return <div className="flex items-center justify-center min-h-screen bg-[#FDF9EE]"><Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin" /></div>;
    }

    const { bookingData, financials } = paymentData;

    return (
        <div className="max-w-[1200px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
            <button
                onClick={() => navigate('/patient/book-appointment', { replace: true })}
                className="flex items-center gap-2 text-gray-500 hover:text-[#4A7C59] font-bold mb-8 transition-colors"
            >
                <ChevronLeft size={20} /> Back to Booking
            </button>

            <div className="flex items-center gap-4 mb-8">
                <div className="bg-[#4A7C59] p-3 rounded-2xl text-white shadow-md">
                    <CreditCard size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">Complete Payment</h1>
                    <p className="text-gray-500 font-medium mt-1">Secure checkout for your upcoming consultation</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-green-50 text-[#4A7C59] px-4 py-2 rounded-bl-2xl font-bold text-xs flex items-center gap-1 border-b border-l border-green-100">
                        <ShieldCheck size={14} /> 100% Secure SSL
                    </div>

                    <h3 className="text-xl font-bold mb-6 mt-4">Payment Details</h3>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100">
                        <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">Total Amount Payable</p>
                        <p className="text-4xl font-extrabold text-gray-900">₹{financials.total}</p>
                    </div>

                    <button
                        onClick={handlePayNow}
                        disabled={isProcessing}
                        className="w-full bg-[#4A7C59] hover:bg-[#3A6447] disabled:bg-[#4A7C59]/70 text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                    >
                        {isProcessing ? <><Loader2 className="animate-spin" size={24} /> Processing...</> : 'Pay Securely'}
                    </button>

                    <button
                        onClick={handleCancelPayment}
                        disabled={isProcessing}
                        className="w-full mt-4 text-red-500 hover:text-red-600 font-bold py-4 rounded-2xl hover:bg-red-50 transition-colors"
                    >
                        Cancel Transaction
                    </button>
                </div>

                <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm h-fit">
                    <h3 className="text-lg font-bold mb-6">Consultation Summary</h3>
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <span className="text-gray-500 font-medium">Doctor</span>
                            <span className="font-bold text-gray-900">{bookingData.doctorName}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <span className="text-gray-500 font-medium">Date & Time</span>
                            <span className="font-bold text-[#4A7C59]">{bookingData.date} at {bookingData.time}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <span className="text-gray-500 font-medium">Consultation Fee</span>
                            <span className="font-bold text-gray-900">₹{financials.fee}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 pb-4">
                            <span className="text-gray-500 font-medium">Taxes & Fees</span>
                            <span className="font-bold text-gray-900">₹{financials.tax}</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="text-gray-900 font-extrabold text-lg">Total</span>
                            <span className="font-extrabold text-[#4A7C59] text-xl">₹{financials.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            <AppointmentSuccessModal
                isOpen={paymentStatus === 'success'}
                onClose={() => navigate('/patient/appointments', { replace: true })}
                appointmentDetails={{
                    doctorName: bookingData.doctorName,
                    date: bookingData.date,
                    time: bookingData.time,
                    id: 'PAY-SUCCESS'
                }}
            />

            {paymentStatus === 'cancelled' && (
                <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-10 max-w-md w-full shadow-2xl text-center relative animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertCircle size={40} className="text-red-500" />
                        </div>
                        <h2 className="text-3xl font-extrabold mb-4 text-gray-900">Payment Cancelled</h2>
                        <p className="text-gray-500 font-medium mb-8">Your appointment has not been booked. You can try booking again.</p>
                        <button
                            onClick={() => navigate('/patient/book-appointment', { replace: true })}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-4 rounded-2xl transition-colors"
                        >
                            Return to Booking
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ConsultationPaymentPage;