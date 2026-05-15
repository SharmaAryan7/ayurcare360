import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Search, X, Menu } from 'lucide-react';
import DoctorSidebar from './DoctorSidebar';
import { doctorApi } from '../../../api/doctorApi';

const DoctorLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState('');
    const [profile, setProfile] = useState(null);
    
    // NEW: State to control the sidebar
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        setIsSidebarOpen(false); // Close sidebar on route change
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
        <div className="flex h-screen bg-[#FDF9EE] overflow-hidden font-sans">
            <DoctorSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden w-full relative">
                {/* Responsive Header */}
                <header className="h-16 md:h-20 lg:h-24 px-4 md:px-6 lg:px-10 flex items-center justify-between bg-[#FDF9EE] shrink-0 border-b border-gray-200 z-10 shadow-sm">
                    
                    {/* Left Side: Hamburger & Search */}
                    <div className="flex items-center gap-3 md:gap-6 flex-1">
                        {/* The 3-line hamburger menu to open the sidebar */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 rounded-xl text-gray-700 hover:bg-[#E7F3EB] hover:text-[#4A7C59] transition-colors focus:outline-none"
                        >
                            <Menu size={24} />
                        </button>

                        <div className="relative w-full max-w-lg hidden sm:block">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={getSearchPlaceholder()}
                                className="w-full h-10 pl-12 pr-10 py-2.5 bg-[#EEE8D7] border-none rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/30 shadow-sm text-xs md:text-sm text-gray-900 placeholder-gray-500 transition-all"
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
                    </div>

                    <div className="flex items-center gap-4 md:gap-6 shrink-0">
                        <div
                            onClick={() => navigate('/doctor/profile')}
                            className="flex items-center gap-3 md:gap-4 cursor-pointer hover:opacity-80 transition-opacity"
                        >
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-gray-900 leading-tight">{doctorName}</p>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mt-0.5">{specialization}</p>
                            </div>
                            <div className="w-8 h-8 md:w-12 md:h-12 rounded-full border border-gray-200 shadow-sm overflow-hidden bg-gray-100 shrink-0">
                                <img
                                    src={avatarUrl}
                                    className="w-full h-full object-cover"
                                    alt="Doctor Avatar"
                                />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Search Bar (Shows below header on very small screens) */}
                <div className="sm:hidden px-4 py-3 bg-[#FDF9EE] border-b border-gray-100 shrink-0">
                    <div className="relative w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-10 pr-10 py-2.5 bg-[#EEE8D7] border-none rounded-full text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 transition-all shadow-sm"
                        />
                         {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <main className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
                    <Outlet context={{ searchQuery }} />
                </main>
            </div>
        </div>
    );
};

export default DoctorLayout;