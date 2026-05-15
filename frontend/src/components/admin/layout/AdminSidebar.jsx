import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Stethoscope, ShoppingCart, Package, FileText, BarChart3, Settings, LogOut } from 'lucide-react';

const AdminSidebar = ({ systemStatus = 'normal' }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear ALL auth data completely
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');

    // Redirect to login page
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
    <div className="w-64 bg-[#3A6447] min-h-screen text-white flex flex-col fixed left-0 top-0 bottom-0 z-50">

      {/* Logo Area */}
      <div className="p-8 flex items-center gap-3">
        <img
          src="/Favicon_up.png"
          alt="Ayurcare360 Logo"
          className="w-10 h-10 rounded-full object-cover shadow-md border border-white/20 bg-white"
        />
        <div>
          <h1 className="text-lg font-bold leading-tight">Ayurcare360</h1>
          <p className="text-[10px] text-white/70 uppercase tracking-widest font-bold">Health Admin</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all
              ${isActive ? 'bg-white/20 text-white shadow-inner' : 'text-white/70 hover:bg-white/10 hover:text-white'}
            `}
          >
            <item.icon size={18} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Area: System Status & Logout */}
      <div className="mt-auto">
        {/* System Status */}
        <div className="p-4 px-6 mb-2">
          <div className="bg-white/10 rounded-2xl p-4 flex items-center gap-3 border border-white/5">
            <div className={`w-2 h-2 rounded-full ${isSystemNormal ? 'bg-green-400 animate-pulse' : 'bg-red-400 animate-pulse'}`}></div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-0.5">System Status</p>
              <p className="text-xs font-bold text-white">{isSystemNormal ? 'All systems normal' : 'System degraded'}</p>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10 bg-black/5">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-red-100 bg-red-500/10 hover:bg-red-500/20 hover:text-white rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminSidebar;