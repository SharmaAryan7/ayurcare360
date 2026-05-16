import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Menu, X } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';

const AdminTopbar = ({ setIsSidebarOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminProfile, setAdminProfile] = useState({ name: 'Admin', role: 'Chief Administrator' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // const res = await adminApi.getAdminDetails('me'); 
        // setAdminProfile({ name: res.data.full_name, role: res.data.role });
      } catch (e) { }
    };
    fetchProfile();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/admin/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col shrink-0">
      <div className="h-16 md:h-20 lg:h-24 px-4 md:px-6 lg:px-10 flex items-center justify-between bg-[#FDF9EE] shrink-0 border-b border-gray-200 z-10 shadow-sm">
        
        <div className="flex items-center gap-3 md:gap-6 flex-1">
          {/* Hamburger Menu (Hidden on Desktop using lg:hidden) */}
          <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-gray-700 hover:bg-[#E7F3EB] hover:text-[#3A6447] transition-colors focus:outline-none"
          >
              <Menu size={24} />
          </button>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="relative w-full max-w-md hidden sm:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patients, doctors or medical records..."
              className="w-full bg-white border border-[#EFEBE1] rounded-full py-2.5 pl-12 pr-4 text-xs md:text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 shadow-sm transition-all"
            />
             {searchQuery && (
                <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <X size={14} />
                </button>
            )}
            <button type="submit" className="hidden">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          <div className="text-right hidden md:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{adminProfile.name}</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">{adminProfile.role}</p>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#3A6447] text-white text-xs md:text-sm font-bold flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-[#2C4D36] transition-colors shrink-0">
            {getInitials(adminProfile.name)}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 py-3 bg-[#FDF9EE] border-b border-gray-100 shrink-0">
          <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-10 pr-10 py-2.5 bg-white border border-[#EFEBE1] rounded-full text-sm font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all shadow-sm"
              />
                {searchQuery && (
                  <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-900 transition-colors"
                  >
                      <X size={14} />
                  </button>
              )}
               <button type="submit" className="hidden">Search</button>
          </form>
      </div>
    </div>
  );
};

export default AdminTopbar;