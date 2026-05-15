import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, ShoppingCart, Package, FileText, BarChart3, Settings, LogOut, X } from 'lucide-react';

const AdminSidebar = ({ isOpen, setIsOpen, systemStatus = 'normal' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/LandingPage');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Doctors', path: '/admin/doctors', icon: Stethoscope },
    { name: 'Patients', path: '/admin/patients', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Inventory', path: '/admin/inventory', icon: Package },
    { name: 'Blogs', path: '/admin/blogs', icon: FileText },
    { name: 'Reports', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const isSystemNormal = systemStatus === 'normal';

  return (
    <>
        {/* Dark Overlay Backdrop */}
        <div 
            className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            onClick={() => setIsOpen(false)}
        />

        {/* Sliding Sidebar */}
        <div 
            className={`fixed top-0 left-0 h-full z-50 w-64 sm:w-72 bg-[#3A6447] text-white flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
        >

          {/* Logo Area */}
          <div className="p-5 sm:p-8 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img
                src="/Favicon_up.png"
                alt="Ayurcare360 Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-md border border-white/20 bg-white shrink-0"
              />
              <div>
                <h1 className="text-base sm:text-lg font-bold leading-tight">Ayurcare360</h1>
                <p className="text-[9px] sm:text-[10px] text-white/70 uppercase tracking-widest font-bold">Health Admin</p>
              </div>
            </div>

             {/* Close Button inside Sidebar */}
             <button 
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-white/80 hover:text-white transition-colors focus:outline-none"
            >
                <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 sm:px-4 space-y-1.5 overflow-y-auto custom-scrollbar pb-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-2xl text-sm sm:text-base font-bold transition-all
                  ${isActive ? 'bg-white/20 text-white shadow-inner scale-[1.02]' : 'text-white/70 hover:bg-white/10 hover:text-white hover:pl-5'}
                `}
              >
                <item.icon size={18} className="shrink-0" />
                <span className="truncate">{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* Bottom Area: System Status & Logout */}
          <div className="mt-auto shrink-0">
            {/* System Status */}
            <div className="p-3 sm:p-4 sm:px-6 mb-1 sm:mb-2">
              <div className="bg-white/10 rounded-2xl p-3 sm:p-4 flex items-center gap-3 border border-white/5">
                <div className={`w-2 h-2 rounded-full shrink-0 ${isSystemNormal ? 'bg-green-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5 truncate">System Status</p>
                  <p className="text-[11px] sm:text-xs font-bold text-white truncate">{isSystemNormal ? 'All systems normal' : 'System degraded'}</p>
                </div>
              </div>
            </div>

            {/* Logout Button */}
            <div className="p-4 border-t border-white/10 bg-black/5">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base font-bold text-red-100 bg-red-500/10 hover:bg-red-500/20 hover:text-white rounded-xl transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>

        </div>
    </>
  );
};

export default AdminSidebar;