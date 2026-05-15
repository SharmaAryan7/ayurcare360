import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import { authApi } from '../../api/authApi';

const SignInPage = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
      await authApi.sendSignupOtps({ email, phone: formattedPhone });
      navigate('/verify', { state: { email, phone: formattedPhone } });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to send verification codes.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-gray-900 min-h-screen flex flex-col font-sans">
      <header className="flex flex-col items-center justify-center w-full pt-12 pb-4">
        <div className="flex flex-col items-center gap-3">
          <span className="text-2xl font-extrabold text-[#3A6447] tracking-tight">AyurCare360</span>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4 pb-20">
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#EFEBE1]">
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-1.5">
              <div className="h-1.5 w-6 rounded-full bg-[#3A6447]"></div>
              <div className="h-1.5 w-6 rounded-full bg-[#EFEBE1]"></div>
              <div className="h-1.5 w-6 rounded-full bg-[#EFEBE1]"></div>
              <div className="h-1.5 w-6 rounded-full bg-[#EFEBE1]"></div>
            </div>
            <span className="text-[10px] font-bold text-[#3A6447] tracking-widest uppercase">Step 1 of 4</span>
          </div>

          <div className="space-y-2 mb-10 text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Start your journey</h1>
            <p className="text-gray-500 font-medium text-sm">Enter your details to receive OTPs</p>
          </div>

          {error && <p className="text-red-500 text-xs text-center mb-4 font-bold">{error}</p>}

          <form className="space-y-6" onSubmit={handleSubmit}>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  className="block w-full h-12 pl-12 pr-4 bg-white border border-[#EFEBE1] focus:border-[#3A6447] focus:ring-1 rounded-xl text-sm font-medium text-gray-900 outline-none"
                  placeholder="name@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mobile Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <Phone size={18} />
                </div>
                <input
                  className="block w-full h-12 pl-12 pr-4 bg-white border border-[#EFEBE1] focus:border-[#3A6447] focus:ring-1 rounded-xl text-sm font-medium text-gray-900 outline-none"
                  placeholder="+91 00000-00000"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              className="w-full py-4 mt-4 bg-[#3A6447] text-white font-bold text-sm rounded-full shadow-sm hover:bg-[#2C4D36] transition-colors disabled:opacity-50"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Sending Codes...' : 'Send OTPs'}
            </button>
          </form>

          <div className="pt-6 text-center">
            <Link className="text-[#3A6447] text-sm font-bold hover:underline transition-all" to="/login">
              Already have an account? Login
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SignInPage;