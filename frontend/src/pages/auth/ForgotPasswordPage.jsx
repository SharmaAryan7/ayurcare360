import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { authApi } from '../../api/authApi';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Detect if input is email or phone
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
    const payload = isEmail ? { email: identifier } : { phone: identifier };

    try {
      await authApi.forgotPassword(payload);
      // Pass the identifier to the reset page
      navigate('/reset-password', { state: { identifier, isEmail } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-gray-900 font-sans min-h-screen flex flex-col items-center">
      <header className="w-full pt-16 flex flex-col items-center gap-3">
        <h1 className="font-extrabold text-2xl tracking-tight text-[#3A6447]">AyurCare360</h1>
      </header>

      <main className="flex-grow flex items-center justify-center px-6 w-full max-w-md">
        <div className="bg-white rounded-[32px] p-8 md:p-12 w-full shadow-sm border border-[#EFEBE1]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Forgot password?</h2>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Enter your registered mobile number or email to receive a verification code.
            </p>
          </div>

          {error && <p className="text-red-500 text-xs text-center mb-4 font-bold">{error}</p>}

          <form className="space-y-6" onSubmit={handleSendOTP}>
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">
                Mobile Number or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  className="w-full h-12 pl-12 pr-4 bg-white border border-[#EFEBE1] rounded-xl focus:border-[#3A6447] focus:ring-1 focus:ring-[#3A6447]/30 text-sm font-medium text-gray-900 outline-none"
                  placeholder="+91 00000 00000"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="w-full py-4 bg-[#3A6447] hover:bg-[#2C4D36] transition-colors text-white font-bold rounded-full flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              <span>{isLoading ? 'Sending...' : 'Send OTP'}</span>
              <ArrowRight size={18} />
            </button>

            <div className="pt-4 text-center">
              <Link className="text-[#3A6447] text-sm font-bold hover:underline" to="/login">Back to Login</Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;