import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ChevronLeft } from 'lucide-react';
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

    // Listen for live updates from the profile page
    const handleUpdate = (e) => {
      if (e.detail) {
        setProfile(prev => ({ ...prev, avatar: e.detail }));
      }
    };
    window.addEventListener('avatarUpdated', handleUpdate);

    return () => window.removeEventListener('avatarUpdated', handleUpdate);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) return 'Patient Dashboard';
    if (path.includes('appointments')) return 'Appointments';
    if (path.includes('prescriptions')) return 'Prescriptions';
    if (path.includes('health-records')) return 'Health Records';
    if (path.includes('pharmacy-orders')) return 'Pharmacy Orders';
    if (path.includes('pharmacy-store')) return 'Pharmacy Store';
    if (path.includes('profile')) return 'Patient Profile';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('cart')) return 'Your Cart';
    if (path.includes('checkout')) return 'Checkout';
    return 'Patient Portal';
  };

  const getSearchPlaceholder = () => {
    const path = location.pathname;
    if (path.includes('pharmacy-store')) return 'Search medicines, supplements, or Ayurvedic products...';
    if (path.includes('appointments')) return 'Search doctors or past consultations...';
    if (path.includes('prescriptions')) return 'Search medicines in your prescriptions...';
    if (path.includes('health-records')) return 'Search clinical data or report names...';
    if (path.includes('pharmacy-orders')) return 'Search by Order ID or product name...';
    return 'Search medical history, doctors...';
  };

  const isProductDetailsPage = location.pathname.includes('/pharmacy-store/') && location.pathname !== '/patient/pharmacy-store';

  const handleSearchChange = (e) => {
    setGlobalSearchQuery(e.target.value);
  };

  return (
    <div className="flex h-screen bg-[#FDF9EE] font-sans">
      <PatientSidebar />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 px-10 flex items-center justify-between border-b border-gray-200 shrink-0 shadow-sm z-10">

          <div className="relative w-[480px]">
            {isProductDetailsPage ? (
              <button
                onClick={() => navigate('/patient/pharmacy-store')}
                className="text-gray-500 hover:text-[#2D5A27] flex items-center gap-2 font-medium transition-colors py-3"
              >
                <ChevronLeft size={20} />
                Back to Pharmacy Store
              </button>
            ) : (
              <>
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  value={globalSearchQuery}
                  onChange={handleSearchChange}
                  placeholder={getSearchPlaceholder()}
                  className="w-full pl-12 pr-4 py-3 bg-[#F3F0E9] border-none rounded-full text-sm font-medium text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59]/20 transition-all"
                />
              </>
            )}
          </div>

          <div className="flex items-center gap-6">
            <span className="text-sm font-bold text-gray-900">{getPageTitle()}</span>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/patient/cart')}
                className="text-gray-600 hover:text-[#4A7C59] transition-colors relative cursor-pointer"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#4A7C59] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

            {isLoadingProfile ? (
              <div className="w-9 h-9 rounded-full bg-gray-200 animate-pulse border border-gray-200 shadow-sm shrink-0"></div>
            ) : profile?.avatar ? (
              <img
                src={profile.avatar}
                alt="Profile"
                onClick={() => navigate('/patient/profile')}
                className="w-9 h-9 rounded-full border border-gray-200 shadow-sm object-cover cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              />
            ) : (
              <div
                onClick={() => navigate('/patient/profile')}
                className="w-9 h-9 rounded-full border border-[#EFEBE1] shadow-sm bg-[#E7F3EB] text-[#4A7C59] flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80 transition-opacity shrink-0"
              >
                {(profile?.name || profile?.full_name || 'U').charAt(0)}
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {/* Passing the global profile down to the child routes! */}
          <Outlet context={{ globalSearchQuery, globalProfile: profile, isLoadingProfile }} />
        </div>
      </main>
    </div>
  );
};

export default PatientLayout;