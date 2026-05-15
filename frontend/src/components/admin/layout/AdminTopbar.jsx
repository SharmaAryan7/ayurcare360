import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { adminApi } from '../../../api/adminApi';
// Assuming a call exists to get basic session/profile context. If not, it safely falls back to standard text.

const AdminTopbar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [adminProfile, setAdminProfile] = useState({ name: 'Admin', role: 'Chief Administrator' });
  const navigate = useNavigate();

  // Try to load context dynamically if the endpoint exists, otherwise fallback to "Admin"
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Attempt to fetch current logged in user details if available
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
    <div className="h-24 px-10 flex items-center justify-between bg-[#FDF9EE] sticky top-0 z-40">
      <form onSubmit={handleSearch} className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search patients, doctors or medical records..."
          className="w-full bg-white border border-[#EFEBE1] rounded-full py-3 pl-12 pr-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 shadow-sm transition-all"
        />
        <button type="submit" className="hidden">Search</button>
      </form>

      <div className="flex items-center gap-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-bold text-gray-900">{adminProfile.name}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{adminProfile.role}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-[#3A6447] text-white text-sm font-bold flex items-center justify-center border-2 border-white shadow-sm cursor-pointer hover:bg-[#2C4D36] transition-colors">
          {getInitials(adminProfile.name)}
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;