import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const StickyLogo = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check if we are on the store/pharmacy page. 
    // IMPORTANT: Change '/pharmacy' to match your actual route if it's different (e.g. '/store')
    const isPharmacyPage = location.pathname.includes('/pharmacy') || location.pathname.includes('/store');

    const handleClick = () => {
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // PASS STATE HERE to let LandingPage know we clicked the logo
            navigate('/', { state: { fromStickyLogo: true } });
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <button
            onClick={handleClick}
            title="Back to Home"
            // Added dynamic bottom positioning and lowered z-index to 40
            className={`fixed right-8 z-40 w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_4px_25px_rgba(212,154,68,0.4)] hover:scale-105 transition-all duration-300 border-2 border-[#D49A44]/50 cursor-pointer group
        ${isPharmacyPage ? 'bottom-28' : 'bottom-8'} 
      `}
            aria-label="Go to top of landing page"
        >
            <img
                src="/Favicon_up.png"
                alt="AyurCure"
                className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
            />
        </button>
    );
};

export default StickyLogo;