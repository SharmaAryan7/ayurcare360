import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../../components/admin/layout/AdminSidebar';
import AdminTopbar from '../../components/admin/layout/AdminTopbar';

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
      setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-[#FDF9EE] min-h-screen flex font-sans overflow-hidden">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Removed ml-64 to allow full width on mobile, and standard flow on desktop */}
      <div className="flex-1 flex flex-col min-h-screen w-full relative">
        <AdminTopbar setIsSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto custom-scrollbar relative z-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;