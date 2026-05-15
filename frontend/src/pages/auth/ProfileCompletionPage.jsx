import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../api/authApi';
import { patientApi } from '../../api/patientApi';

const ProfileCompletionPage = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract BOTH specific OTPs passed from Step 2
    const { email, phone, emailOtp, phoneOtp } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const navEntries = window.performance.getEntriesByType('navigation');
        const isReload = navEntries.length > 0 && navEntries[0].type === 'reload';

        if (isReload || !email || !phone || !emailOtp || !phoneOtp) {
            navigate('/signup', { replace: true });
        }
    }, [email, phone, emailOtp, phoneOtp, navigate]);

    useEffect(() => {
        if (!email || !phone || !emailOtp || !phoneOtp) {
            navigate('/signup');
        }
    }, [email, phone, emailOtp, phoneOtp, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const fullName = e.target.fullName.value;
        const password = e.target.password.value;
        const gender = e.target.gender.value;
        const age = e.target.age.value;
        const bloodGroup = e.target.bloodGroup.value;
        const weight = e.target.weight.value;
        const height = e.target.height.value;
        const city = e.target.city.value;
        
        const fullAddress = `${e.target.address.value}, ${city}, ${e.target.state.value} - ${e.target.pincode.value}`;

        try {
            await authApi.verifyAndRegister({
                role: 'patient',
                full_name: fullName,
                email: email,
                phone: phone,
                password: password,
                emailOtp: emailOtp,
                phoneOtp: phoneOtp
            });

            // Added height_cm to map precisely to the backend column
            await patientApi.updateProfilePersonal({ 
                age: age, 
                gender: gender, 
                blood_group: bloodGroup, 
                weight_kg: weight,
                height_cm: height
            });

            await patientApi.updateProfileContact({ address: fullAddress });

            navigate('/symptoms');
        } catch (err) {
            setError(err.customMessage || err.response?.data?.error || 'Registration failed. Check your details or OTPs.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-[#FAF7F2] text-gray-900 min-h-screen font-sans">
            <header className="flex flex-col items-center justify-center w-full py-8 px-4">
                <div className="text-2xl font-extrabold text-[#3A6447] tracking-tight">AyurCure360</div>
            </header>

            <main className="min-h-[calc(100vh-180px)] flex items-center justify-center px-6 py-12">
                <div className="max-w-xl w-full">
                    <div className="flex flex-col items-center mb-10">
                        <div className="flex flex-col items-center gap-2 mb-4">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-[#3A6447]">Step 03</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 text-center">Complete your profile</h1>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-[#EFEBE1]">
                        {error && <p className="text-red-500 text-xs text-center mb-4 font-bold">{error}</p>}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                                    <input id="fullName" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="Aarav Sharma" type="text" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Email</label>
                                    <input value={email || ''} readOnly className="w-full h-12 bg-gray-50 border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-500 outline-none" type="email" />
                                </div>

                                {/* Password field with visibility toggle */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Password</label>
                                    <div className="relative">
                                        <input 
                                            id="password" 
                                            className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 pr-12 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" 
                                            placeholder="••••••••" 
                                            type={showPassword ? "text" : "password"} 
                                            required 
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3A6447] transition-colors focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Gender</label>
                                    <div className="relative">
                                        <select id="gender" defaultValue="" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 appearance-none focus:border-[#3A6447] outline-none" required>
                                            <option disabled value="">Select</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Age</label>
                                    <input id="age" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="28" type="number" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Blood Group</label>
                                    <div className="relative">
                                        <select id="bloodGroup" defaultValue="" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 appearance-none focus:border-[#3A6447] outline-none" required>
                                            <option disabled value="">Select</option>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                            <ChevronDown size={18} />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Weight (kg)</label>
                                    <input id="weight" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="70" type="number" step="0.1" required />
                                </div>

                                {/* New Height Field */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Height (cm)</label>
                                    <input id="height" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="175" type="number" step="0.1" required />
                                </div>

                                <div className="space-y-2 col-span-full">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Address</label>
                                    <input id="address" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="123 Wellness Lane, Green Park" type="text" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">City</label>
                                    <input id="city" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="Mumbai" type="text" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">State</label>
                                    <input id="state" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="Maharashtra" type="text" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Pincode</label>
                                    <input id="pincode" className="w-full h-12 bg-white border border-[#EFEBE1] rounded-xl px-4 text-sm font-medium text-gray-900 focus:border-[#3A6447] outline-none" placeholder="400001" type="text" required />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button disabled={isLoading} className="w-full bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold h-12 rounded-full shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50" type="submit">
                                    {isLoading ? 'Creating Profile...' : 'Continue'}
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileCompletionPage;