import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/authApi';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const identifier = location.state?.identifier;
  const isEmail = location.state?.isEmail;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!identifier) navigate('/forgot-password');
  }, [identifier, navigate]);

  const handleOtpChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== '') element.nextSibling.focus();
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');

    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) return setError('Passwords do not match.');

    setIsLoading(true);
    try {
      const payload = {
        otp: otp.join(''),
        newPassword,
        ...(isEmail ? { email: identifier } : { phone: identifier })
      };

      await authApi.resetPassword(payload);
      alert('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] text-gray-900 font-sans min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <section className="w-full max-w-md">
          <div className="bg-white rounded-[32px] border border-[#EFEBE1] shadow-sm p-8 md:p-12">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">Reset password</h2>
              <p className="text-gray-500 font-medium text-sm">
                Enter the 6-digit code sent to {identifier}
              </p>
            </div>

            {error && <p className="text-red-500 text-xs text-center mb-4 font-bold">{error}</p>}

            <form className="space-y-8" onSubmit={handleReset}>
              <div className="space-y-4">
                <div className="flex justify-between gap-2">
                  {otp.map((data, index) => (
                    <input
                      key={index} type="text" maxLength="1" required
                      className="w-12 h-12 text-center text-xl font-bold rounded-xl border border-[#EFEBE1] focus:border-[#3A6447] focus:ring-1 outline-none"
                      value={data}
                      onChange={e => handleOtpChange(e.target, index)}
                      onFocus={e => e.target.select()}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                  <input id="newPassword" placeholder="New Password" type={showNewPassword ? "text" : "password"} required className="w-full h-12 pl-4 pr-12 rounded-xl border border-[#EFEBE1] focus:border-[#3A6447] outline-none text-sm" />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="relative">
                  <input id="confirmPassword" placeholder="Confirm Password" type={showNewPassword ? "text" : "password"} required className="w-full h-12 pl-4 pr-12 rounded-xl border border-[#EFEBE1] focus:border-[#3A6447] outline-none text-sm" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-4 bg-[#3A6447] text-white font-bold rounded-full disabled:opacity-50">
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ResetPasswordPage;