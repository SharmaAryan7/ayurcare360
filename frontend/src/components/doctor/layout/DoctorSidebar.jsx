import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, DollarSign, User, Settings, LogOut, X } from 'lucide-react';

const DoctorSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear all auth data completely from local storage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        // Redirect to login page
        navigate('/LandingPage');
    };

    const navItems = [
        { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
        { name: 'Earnings', path: '/doctor/earnings', icon: DollarSign },
        { name: 'Profile', path: '/doctor/profile', icon: User },
        { name: 'Settings', path: '/doctor/settings', icon: Settings },
    ];

    return (
        <>
            {/* Dark Overlay Backdrop (Hidden on Desktop using lg:hidden) */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sliding Sidebar (Always visible on Desktop using lg:translate-x-0) */}
            <aside 
                className={`fixed top-0 left-0 h-full z-50 w-64 sm:w-72 bg-[#4A7C59] text-white flex flex-col shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Area */}
                <div className="p-5 sm:p-6 flex items-center justify-between border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            alt="Ayurcare360 Logo"
                            src="/Favicon_up.png"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md border border-white/20 bg-white"
                        />
                        <span className="text-lg sm:text-xl font-bold tracking-wide">Ayurcare360</span>
                    </div>

                    {/* Close Button inside Sidebar (Hidden on Desktop) */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 px-3 sm:px-4 mt-6 space-y-1.5 overflow-y-auto custom-scrollbar pb-6">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm sm:text-base ${isActive
                                    ? 'bg-white text-[#4A7C59] font-semibold shadow-sm scale-[1.02]'
                                    : 'text-white/80 hover:bg-white/10 hover:text-white font-medium hover:pl-5'
                                }`
                            }
                        >
                            <item.icon size={18} className="shrink-0" />
                            <span className="truncate">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Button */}
                <div className="p-4 mt-auto border-t border-white/10 bg-black/10 shrink-0">
                    <button
                        onClick={handleLogout}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm sm:text-base font-bold text-red-100 bg-red-500/10 hover:bg-red-500/20 hover:text-white rounded-xl transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default DoctorSidebar;