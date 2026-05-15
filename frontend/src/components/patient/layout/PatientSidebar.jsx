import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Calendar,
    FileText,
    Activity,
    ShoppingBag,
    Store,
    User,
    Settings,
    LogOut,
    X // Added close icon
} from 'lucide-react';

const PatientSidebar = ({ isOpen, setIsOpen }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');
        navigate('/LandingPage', { replace: true });
    };

    const navItems = [
        { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
        { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
        { name: 'Prescriptions', path: '/patient/prescriptions', icon: FileText },
        { name: 'Health Records', path: '/patient/health-records', icon: Activity },
        { name: 'Pharmacy Orders', path: '/patient/pharmacy-orders', icon: ShoppingBag },
        { name: 'Pharmacy Store', path: '/patient/pharmacy-store', icon: Store },
        { name: 'Profile', path: '/patient/profile', icon: User },
        { name: 'Settings', path: '/patient/settings', icon: Settings },
    ];

    return (
        <>
            {/* Dark Overlay Backdrop - clicks outside the sidebar close it */}
            <div 
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
            />

            {/* Sliding Sidebar */}
            <aside 
                className={`fixed top-0 left-0 h-full z-50 w-64 sm:w-72 bg-[#4A7C59] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo & Close Button Area */}
                <div className="p-5 sm:p-6 flex items-center justify-between border-b border-white/10 shrink-0">
                    <div className="flex items-center gap-3">
                        <img
                            src="/Favicon_up.png"
                            alt="Ayurcare360 Logo"
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md border border-white/20 bg-white"
                        />
                        <span className="text-lg sm:text-xl font-bold tracking-wide">Ayurcare360</span>
                    </div>
                    
                    {/* Close Button inside Sidebar */}
                    <button 
                        onClick={() => setIsOpen(false)}
                        className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors focus:outline-none"
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
                                    : 'text-white/80 hover:bg-white/10 hover:text-white font-medium hover:pl-5' // slight padding shift on hover
                                }`
                            }
                        >
                            <item.icon size={18} className="shrink-0" />
                            <span className="truncate">{item.name}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Logout Snippet */}
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

export default PatientSidebar;