import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronLeft, Menu } from 'lucide-react';
import PatientSidebar from './PatientSidebar';
import { useCart } from '../../../context/CartContext';
import { patientApi } from '../../../api/patientApi';

const PatientLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartCount } = useCart();
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // NEW: State to control the sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchGlobalProfile = async () => {
      try {
        const data = await patientApi.getProfilePersonal();
        setProfile(data.profile || data);
      } catch (error) {
        console.error("Failed to load user profile for layout", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };
    fetchGlobalProfile();

    const handleUpdate = (e) => {
      if (e.detail) {
        setProfile(prev => ({ ...prev, avatar: e.detail }));
      }
    };
    window.addEventListener('avatarUpdated', handleUpdate);

    return () => window.removeEventListener('avatarUpdated', handleUpdate);
  }, []);

  // Close sidebar automatically when the route changes (user clicks a link)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('appointments')) return 'Appointments';
    if (path.includes('prescriptions')) return 'Prescriptions';
    if (path.includes('health-records')) return 'Health Records';
    if (path.includes('pharmacy-orders')) return 'Orders';
    if (path.includes('pharmacy-store')) return 'Pharmacy';
    if (path.includes('profile')) return 'Profile';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('cart')) return 'Cart';
    if (path.includes('checkout')) return 'Checkout';
    return 'Portal';
  };

  const getSearchPlaceholder = () => {
    const path = location.pathname;
    if (path.includes('pharmacy-store')) return 'Search medicines...';
    if (path.includes('appointments')) return 'Search doctors...';
    if (path.includes('prescriptions')) return 'Search medicines...';
    if (path.includes('health-records')) return 'Search reports...';
    if (path.includes('pharmacy-orders')) return 'Search orders...';
    return 'Search...';
  };

  const isProductDetailsPage = location.pathname.includes('/pharmacy-store/') && location.pathname !== '/patient/pharmacy-store';

  const handleSearchChange = (e) => {
    setGlobalSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-screen bg-[#FDF9EE] font-sans overflow-hidden">
      {/* Sidebar now accepts props to control its open/close state */}
      <PatientSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main className="flex-1 flex flex-col w-full h-full relative">
        {/* Responsive Header */}
        <header className="h-16 md:h-20 lg:h-24 px-4 md:px-6 lg:px-10 flex items-center justify-between border-b border-gray-200 shrink-0 shadow-sm z-10 bg-[#FDF9EE]">

          {/* Left Side: Hamburger & Search */}
          <div className="flex items-center gap-3 md:gap-6 flex-1">
            {/* The 3-line hamburger menu to open the sidebar */}
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-gray-700 hover:bg-[#E7F3EB] hover:text-[#4A7C59] transition-colors focus:outline-none"
            >
              <Menu size={24} />
            </button>

            {/* Responsive Search Bar - Hidden on very small screens, expands on larger screens */}
            <div className="relative flex-1 max-w-[480px] hidden sm:block">
              {isProductDetailsPage ? (
                <button
                  onClick={() => navigate('/patient/pharmacy-store')}
                  className="text-gray-500 hover:text-[#2D5A27] flex items-center gap-2 text-sm md:text-base font-medium transition-colors py-3"
                >
                  <ChevronLeft size={20} />
                  <span className="hidden md:inline">Back to Pharmacy Store</span>
                  <span className="md:hidden">Back</span>
                </button>
              ) : (
                <>
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={globalSearchQuery}
                    onChange={handleSearchChange}
                    placeholder={getSearchPlaceholder()}
                    className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-[#F3F0E9] border-none rounded-full text-xs md:text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 transition-all"
                  />
                </>
              )}
            </div>
          </div>

          {/* Right Side: Title, Cart, Profile */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Title hidden on mobile to save space if search is active */}
            <span className="text-sm md:text-base font-bold text-gray-900 truncate max-w-[120px] md:max-w-none">
              {getPageTitle()}
            </span>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/patient/cart')}
                className="text-gray-600 hover:text-[#4A7C59] transition-colors relative cursor-pointer p-1"
              >
                <ShoppingCart size={20} className="md:w-6 md:h-6" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 md:-top-2 md:-right-2 bg-[#4A7C59] text-white text-[9px] md:text-[10px] font-bold w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full border border-[#FDF9EE]">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {isLoadingProfile ? (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-200 animate-pulse border border-gray-200 shadow-sm shrink-0"></div>
            ) : profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile"
                onClick={() => navigate('/patient/profile')}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-200 shadow-sm object-cover cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              />
            ) : (
              <div
                onClick={() => navigate('/patient/profile')}
                className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-[#EFEBE1] shadow-sm bg-[#E7F3EB] text-[#4A7C59] flex items-center justify-center font-bold text-xs md:text-sm cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              >
                {(profile?.name || profile?.full_name || 'U').charAt(0)}
              </div>
            )}
          </div>
        </header>

        {/* Mobile Search Bar (Shows below header on very small screens) */}
        {!isProductDetailsPage && (
          <div className="sm:hidden px-4 py-3 bg-[#FDF9EE] border-b border-gray-100 shrink-0">
             <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  value={globalSearchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2.5 bg-[#F3F0E9] border-none rounded-full text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 transition-all"
                />
             </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-0">
          <Outlet context={{ globalSearchQuery, globalProfile: profile, isLoadingProfile }} />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;