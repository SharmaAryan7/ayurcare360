import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';

const LoginPage = () => {
    const navigate = useNavigate();
    // Only showing Patient and Doctor to the public
    const [loginRole, setLoginRole] = useState('patient');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const identifier = e.target.identifier.value;
        const password = e.target.password.value;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);

        const payload = {
            password,
            role: loginRole,
            ...(isEmail ? { email: identifier } : { phone: identifier })
        };

        try {
            // First attempt: Try logging in as whatever tab is selected
            const response = await authApi.login(payload);

            if (response.user.role === 'doctor') {
                navigate('/doctor/dashboard', { replace: true });
            } else {
                navigate('/patient/dashboard', { replace: true });
            }
        } catch (err) {
            const errorMsg = err.response?.data?.error || '';

            // THE TRICK: If the backend throws an error mentioning "admin", 
            // we catch it and silently log them in as an admin!
            if (errorMsg.toLowerCase().includes('admin')) {
                try {
                    const adminPayload = { ...payload, role: 'admin' };
                    await authApi.login(adminPayload);
                    navigate('/admin/dashboard', { replace: true }); // Success! Send to admin panel.
                    return; 
                } catch (adminErr) {
                    setError('Invalid admin credentials.');
                }
            } else {
                // If it's a normal error (wrong password, doesn't exist), show it normally
                setError(errorMsg || 'Invalid credentials. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#FAF7F2] text-gray-900 min-h-screen flex flex-col items-center justify-center font-sans">
            <main className="flex-grow flex items-center justify-center w-full px-6 py-12">
                <div className="max-w-md w-full flex flex-col items-center">
                    <div className="text-center mb-8 space-y-4">
                        <h1 className="text-2xl font-extrabold text-[#3A6447] tracking-tight">AyurCare360</h1>
                        <div className="relative inline-block">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-white border border-[#EFEBE1] flex items-center justify-center shadow-sm">
                                <img alt="AyurCare360 Logo" className="w-full h-full object-cover p-2 rounded-full" src="/Favicon_up.png" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#EFEBE1]">
                        <header className="text-center mb-8">
                            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Welcome back</h2>
                            <p className="text-gray-500 font-medium text-sm">Continue your journey to better health</p>
                        </header>

                        {/* Back to just two beautiful buttons */}
                        <div className="flex p-1 bg-[#FAF7F2] rounded-xl mb-8 border border-[#EFEBE1]">
                            <button
                                type="button"
                                onClick={() => setLoginRole('patient')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${loginRole === 'patient' ? 'bg-white text-[#3A6447] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Patient
                            </button>
                            <button
                                type="button"
                                onClick={() => setLoginRole('doctor')}
                                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${loginRole === 'doctor' ? 'bg-white text-[#3A6447] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                Doctor
                            </button>
                        </div>

                        {error && <p className="text-red-500 text-xs text-center mb-4 font-bold">{error}</p>}

                        <form className="space-y-6" onSubmit={handleLogin}>
                            <div className="space-y-2">
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1" htmlFor="identifier">
                                    Email or Mobile Number
                                </label>
                                <input
                                    className="w-full bg-white border border-[#EFEBE1] rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 focus:border-[#3A6447] focus:ring-1 focus:ring-[#3A6447]/30 transition-all outline-none placeholder:text-gray-400"
                                    id="identifier"
                                    name="identifier"
                                    placeholder="name@example.com or +91..."
                                    type="text"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1" htmlFor="password">
                                        Password
                                    </label>
                                    <Link className="text-[10px] font-bold uppercase tracking-widest text-[#3A6447] hover:text-[#2C4D36] transition-colors duration-200" to="/forgot-password">
                                        Forgot password?
                                    </Link>
                                </div>
                                <input
                                    className="w-full bg-white border border-[#EFEBE1] rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 focus:border-[#3A6447] focus:ring-1 focus:ring-[#3A6447]/30 transition-all outline-none placeholder:text-gray-400"
                                    id="password"
                                    name="password"
                                    placeholder="••••••••"
                                    type="password"
                                    required
                                />
                            </div>

                            <button
                                className="w-full bg-[#3A6447] text-white font-bold py-4 rounded-full hover:bg-[#2C4D36] transition-colors shadow-sm mt-4 disabled:opacity-50"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : `Login as ${loginRole.charAt(0).toUpperCase() + loginRole.slice(1)}`}
                            </button>
                        </form>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 text-xs font-medium">
                                Don’t have an account?
                                <Link className="text-[#3A6447] font-bold hover:underline ml-1" to="/signup">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LoginPage;