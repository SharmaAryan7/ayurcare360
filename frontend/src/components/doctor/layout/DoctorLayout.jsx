import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import DoctorSidebar from './DoctorSidebar';
import { doctorApi } from '../../../api/doctorApi';

const DoctorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [profile, setProfile] = useState(null);

    // Fetch doctor's basic profile details for the header
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await doctorApi.getProfilePersonalInfo();
                if (res.success && res.info) {
                    setProfile(res.info);
                }
            } catch (error) {
                console.error("Failed to fetch layout profile details", error);
            }
        };
        fetchProfile();
    }, []);

    // Clear search query automatically when navigating to a different page
    useEffect(() => {
        setSearchQuery('');
    }, [location.pathname]);

    const getSearchPlaceholder = () => {
        const path = location.pathname;
        if (path.includes('/doctor/dashboard')) return "Search metrics or today's patients...";
        if (path.includes('/doctor/appointments')) return "Search appointments by patient name...";
        if (path.includes('/doctor/earnings')) return "Search transactions by ID or patient...";
        if (path.includes('/doctor/settings')) return "Search settings...";
        if (path.includes('/doctor/profile')) return "Search profile details...";
        return "Search patients, records, or herbs...";
    };

    // Prepare Dynamic Profile Variables
    const doctorName = profile ? `Dr. ${profile.first_name || ''} ${profile.last_name || ''}`.trim() : 'Doctor Profile';
    const specialization = profile?.specialization || 'Ayurvedic Specialist';
    const avatarUrl = profile?.profile_image_url || `https://ui-avatars.com/api/?name=${profile?.first_name || 'Doctor'}&background=E5E7EB&color=4A7C59`;

    return (
        <div className="flex h-screen bg-[#FDF9EE] overflow-hidden">
            <DoctorSidebar />

            <div className="flex-1 flex flex-col overflow-hidden w-full">
                <header className="h-16 pt-5 px-10 flex items-center justify-between bg-[#FDF9EE] z-10">
                    <div className="relative w-full max-w-lg">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-900" size={20} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={getSearchPlaceholder()}
                            className="w-full h-10 pl-14 pr-10 py-4 bg-[#EEE8D7] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/30 shadow-sm text-xs text-black placeholder-gray-700 transition-shadow"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        <div
                            onClick={() => navigate('/doctor/profile')}
                            className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-900 leading-tight">{doctorName}</p>
                                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mt-1">{specialization}</p>
                            </div>
                            <div className="w-14 h-14 rounded-full border-4 border-white shadow-sm overflow-hidden bg-gray-100">
                                <img
                                    src={avatarUrl}
                                    className="w-full h-full object-cover"
                                    alt="Doctor Avatar"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto custom-scrollbar">
                    <Outlet context={{ searchQuery }} />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;