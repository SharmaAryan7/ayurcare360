import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { websiteBlogs } from '../../data/websiteBlogs';
import globe from '../../images/globe-removebg-preview.jpeg'
import asthaImg from '../../images/DrAstha.jpeg';
import abhiImg from '../../images/DrAbhi.jpeg'

// --- ANIMATION WRAPPER COMPONENT ---
const ScrollReveal = ({ children, direction = 'up', className = "" }) => {
  let x = 0;
  let y = 0;

  if (direction === 'left') x = -50;
  if (direction === 'right') x = 50;
  if (direction === 'up') y = 50;

  const variants = {
    hidden: { opacity: 0, x, y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={variants}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- HELPER: ROBUST AUTH CHECKER ---
const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userStr = localStorage.getItem('user');

  let parsedRole = role;
  let loggedIn = !!token || !!role || !!userStr;

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      if (userObj && userObj.role) parsedRole = userObj.role;
    } catch (e) {
      console.error("Failed to parse user from local storage");
    }
  }

  return { loggedIn, role: parsedRole || 'patient' };
};

const LandingPage = ({ isLoggedIn: propIsLoggedIn, userRole: propUserRole, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const fromStickyLogo = location.state?.fromStickyLogo; // Check if user came from sticky logo

  // Initialize with our robust auth checker
  const [isLoggedIn, setIsLoggedIn] = useState(() => propIsLoggedIn || checkAuthStatus().loggedIn);
  const [userRole, setUserRole] = useState(() => propUserRole || checkAuthStatus().role);

  // Dynamic Event Listeners to prevent Stale State
  useEffect(() => {
    const updateAuth = () => {
      const { loggedIn, role } = checkAuthStatus();
      setIsLoggedIn(loggedIn);
      setUserRole(role);
    };

    updateAuth(); // Run immediately on mount

    window.addEventListener('storage', updateAuth);
    window.addEventListener('focus', updateAuth);

    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('focus', updateAuth);
    };
  }, []);

  const handleLogout = () => {
    if (onLogout) onLogout();
    // Clear all possible auth storage keys
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/', { replace: true }); // Clear state flag
  };

  const handleDashboardClick = () => {
    if (userRole === 'admin') navigate('/admin/dashboard');
    else if (userRole === 'doctor') navigate('/doctor/dashboard');
    else navigate('/patient/dashboard');
  };

  // Smart Routing for all CTA Buttons + Bypass Logic
  const handleHeroAction = () => {
    if (fromStickyLogo) {
      // THE BYPASS LOGIC: Inject dummy tokens to bypass the ProtectedRoute checks
      localStorage.setItem('token', 'bypass-token');
      localStorage.setItem('role', 'patient');
      localStorage.setItem('user', JSON.stringify({ role: 'patient', name: 'Bypass User' }));
      setIsLoggedIn(true);
      setUserRole('patient');
      navigate('/patient/dashboard');
      return;
    }

    if (isLoggedIn) {
      if (userRole === 'admin') navigate('/admin/dashboard');
      else if (userRole === 'doctor') navigate('/doctor/dashboard');
      else navigate('/patient/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-[#F5F3EA] text-[#1E1E1E] font-['Inter'] selection:bg-[#bbefc5] selection:text-[#00210d] overflow-x-hidden">

      {/* --- STYLES, FONTS, AND ICON IMPORTS --- */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,400;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
        
        .material-symbols-outlined { 
            font-family: 'Material Symbols Outlined' !important;
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; 
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .image-richness { filter: saturate(1.1) contrast(1.02) sepia(0.02); }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        .float-animate { animation: float 6s ease-in-out infinite; }
        @keyframes fly-bird-1 {
            0% { transform: translate(-50px, 50px) rotate(0deg) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(-300px, -200px) rotate(-15deg) scale(1.2); opacity: 0; }
        }
        @keyframes fly-bird-2 {
            0% { transform: translate(50px, 50px) rotate(0deg) scale(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translate(400px, -150px) rotate(20deg) scale(1.1); opacity: 0; }
        }
        .bird-1 { animation: fly-bird-1 15s linear infinite; }
        .bird-2 { animation: fly-bird-2 18s linear infinite; animation-delay: 4s; }
      `}</style>

      {/* --- WHATSAPP & CONTACT FLOATING BUTTONS --- */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 items-end pointer-events-none">
        <button
          onClick={() => navigate('/contact')}
          className="pointer-events-auto bg-[#F5F3EA] border-2 border-[#2F6F4E]/20 text-[#2F6F4E] px-6 py-3 rounded-full shadow-xl flex items-center gap-3 group hover:bg-[#2F6F4E] hover:text-white transition-all transform hover:-translate-y-1"
        >
          <span className="material-symbols-outlined">mail</span>
          <span className="font-bold text-sm tracking-tight">Contact Us</span>
        </button>

        <button
          onClick={() => window.open('https://wa.me/919236313005', '_blank')}
          className="pointer-events-auto bg-[#25D366] text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 group hover:scale-105 transition-all"
        >
          <div className="flex flex-col items-start leading-none">
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-90 mb-1">24/7 Help</span>
            <span className="font-['Noto_Serif'] font-bold text-base">Book Consultation</span>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.522-2.961-2.638-.087-.117-.708-.941-.708-1.803 0-.863.453-1.288.613-1.465.16-.177.347-.222.463-.222h.334c.107 0 .25.04.385.372.144.354.493 1.203.536 1.291.043.088.07.19.013.31-.058.12-.088.191-.173.29-.086.1-.182.223-.26.305-.094.102-.191.213-.083.399.107.186.478.788 1.025 1.274.704.627 1.295.822 1.481.914.186.092.293.076.402-.049.108-.124.465-.54.589-.723.123-.183.246-.153.415-.091.17.062 1.077.508 1.263.601.187.093.31.139.355.213.045.074.045.432-.099.837z"></path></svg>
          </div>
        </button>
      </div>

      {/* --- TOP NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-[#F5F3EA]/90 backdrop-blur-xl border-b border-[#B8C1B6]/10 py-5 md:py-6">
        <div className="flex justify-between items-center px-4 md:px-8 py-0 w-full max-w-screen-2xl mx-auto">
          {/* Left: Logo & Brand */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-white flex items-center justify-center border border-[#2F6F4E]/20 overflow-hidden shadow-sm">
                <img alt="AyurCare360 Logo" className="w-full h-full object-cover p-1 rounded-full" src="/Favicon_up.png" />
              </div>
              <span className="text-lg md:text-xl font-['Noto_Serif'] font-bold text-[#2F6F4E] tracking-tight">AyurCare 360</span>
            </Link>
          </div>
          {/* Right: CTA */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-4">
              <p className="text-[#1E1E1E]/70 font-['Noto_Serif'] text-sm tracking-wide font-medium">Talk to a real Ayurvedic doctor.</p>
              <span className="text-[8px] md:text-[10px] text-[#C8A96A] font-medium tracking-wide uppercase opacity-90">First consultation at a guided fee</span>
            </div>

            {isLoggedIn || fromStickyLogo ? (
              <div className="flex gap-2">
                <button onClick={handleDashboardClick} className="bg-[#2F6F4E] hover:bg-[#2F6F4E]/90 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-['Noto_Serif'] text-xs md:text-sm tracking-tight shadow-sm hover:shadow-md transition-all active:scale-95 font-bold whitespace-nowrap">
                  Dashboard
                </button>
                <button onClick={handleLogout} className="bg-white border border-red-200 text-red-600 hover:bg-red-50 px-4 md:px-6 py-2 md:py-3 rounded-full font-['Noto_Serif'] text-xs md:text-sm tracking-tight shadow-sm transition-all active:scale-95 font-bold whitespace-nowrap">
                  Logout
                </button>
              </div>
            ) : (
              <button onClick={() => navigate('/login')} className="bg-[#2F6F4E] hover:bg-[#2F6F4E]/90 text-white px-4 md:px-6 py-2 md:py-3 rounded-full font-['Noto_Serif'] text-xs md:text-sm tracking-tight shadow-sm hover:shadow-md transition-all active:scale-95 font-bold whitespace-nowrap">
                Login
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-hidden bg-[#F5F3EA] pt-24 md:pt-32">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <span className="material-symbols-outlined absolute left-1/2 top-1/2 bird-1 text-[#2F6F4E]/30 text-4xl">nest_eco_leaf</span>
          <span className="material-symbols-outlined absolute left-1/2 top-1/2 bird-2 text-[#5F8F6B]/30 text-3xl">nest_eco_leaf</span>
        </div>
        <div className="relative z-10 w-full flex items-center justify-center overflow-visible mb-8 md:mb-12">
          <div className="relative w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img alt="a vibrant textured globe in rich mossy greens and warm terracotta earthy tones with golden sunlight highlights" className="w-full h-full object-contain rounded-full filter saturate-[1.4] contrast-[1.1] animate-[spin_20s_linear_infinite]" src={globe} />

              <div className="absolute inset-[-2%] flex items-center justify-center z-10 animate-[spin_20s_linear_infinite_reverse]">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 500">
                  <defs><path d="M 250, 250 m -210, 0 a 210,210 0 1,1 420,0 a 210,210 0 1,1 -420,0" id="textPath"></path></defs>
                  <text fontFamily="Noto Serif" fontSize="20" fontWeight="500" letterSpacing="0">
                    <textPath href="#textPath" startOffset="0%" style={{ fill: '#C8A96A', fontWeight: 600 }}>
                      स्वस्थस्य स्वास्थ्य रक्षणं, आतुरस्य विकार प्रशमनं च • स्वस्थस्य स्वास्थ्य रक्षणं, आतुरस्य विकार प्रशमनं च • स्वस्थस्य स्वास्थ्य रक्षणं, आतुरस्य विकार प्रशमनं च •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <ScrollReveal>
          <div className="relative z-20 text-center px-6 max-w-4xl mx-auto pb-16 md:pb-20">
            <h1 className="font-['Noto_Serif'] text-4xl sm:text-5xl md:text-7xl mb-4 md:mb-6 tracking-tighter text-[#1E1E1E] drop-shadow-sm font-bold">AyurCare 360</h1>
            <h2 className="font-['Noto_Serif'] text-2xl md:text-4xl text-[#2E573B] mb-3 leading-tight font-bold">Ancient Wisdom.<br />Modern Care.</h2>
            <p className="font-['Noto_Serif'] text-base md:text-xl italic text-[#5F8F6B] mb-4 font-bold">Your body has been speaking. It’s time to actually listen.</p>
            <p className="font-['Inter'] text-base md:text-lg font-semibold text-[#1E1E1E]">Ayurveda, adapted for the life you live today.</p>
          </div>
        </ScrollReveal>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section className="py-24 md:py-32 bg-[#FAF4EB] border-y border-[#B8C1B6]/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 text-center">
          <ScrollReveal direction="up">
            <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl mb-16 md:mb-24 text-[#1E1E1E] font-bold">How It Works</h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16 md:mb-20">
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-[#B8C1B6]/10">
                <div className="w-16 h-16 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center mb-6 text-[#2F6F4E] font-bold text-2xl">1</div>
                <h4 className="font-['Noto_Serif'] text-xl mb-4 font-bold text-[#1E1E1E]">Book Your Consultation</h4>
                <p className="text-[#1E1E1E]/70 leading-relaxed font-['Inter']">Choose a time that works for you and connect with our expert physicians online.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-[#B8C1B6]/10">
                <div className="w-16 h-16 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center mb-6 text-[#2F6F4E] font-bold text-2xl">2</div>
                <h4 className="font-['Noto_Serif'] text-xl mb-4 font-bold text-[#1E1E1E]">Understand Your Imbalance</h4>
                <p className="text-[#1E1E1E]/70 leading-relaxed font-['Inter']">Identify your dosha and the root cause of your symptoms through deep clinical assessment.</p>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up">
              <div className="flex flex-col items-center p-8 bg-white rounded-3xl shadow-sm border border-[#B8C1B6]/10">
                <div className="w-16 h-16 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center mb-6 text-[#2F6F4E] font-bold text-2xl">3</div>
                <h4 className="font-['Noto_Serif'] text-xl mb-4 font-bold text-[#1E1E1E]">Receive Your Plan</h4>
                <p className="text-[#1E1E1E]/70 leading-relaxed font-['Inter']">Get personalized guidance on herbs, nutrition, and daily rituals for sustainable healing.</p>
              </div>
            </ScrollReveal>
          </div>
          <ScrollReveal>
            <button onClick={handleHeroAction} className="bg-[#2F6F4E] text-white px-8 md:px-12 py-4 md:py-5 rounded-full font-['Noto_Serif'] text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 font-bold">
              {fromStickyLogo ? 'Go to Dashboard' : (isLoggedIn ? 'Go to Dashboard' : 'Book Your Consultation')}
            </button>
          </ScrollReveal>
        </div>
      </section>

      {/* --- PHILOSOPHY SECTION --- */}
      <section className="py-16 md:py-32 bg-[#F5F3EA]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12 text-center">
          <div className="flex flex-col items-center">
            <ScrollReveal>
              <div className="mb-10 md:mb-16 relative w-full max-w-[500px] mx-auto">
                <div className="absolute inset-0 rounded-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] -z-10 transform scale-95"></div>
                <img alt="a natural pink lotus flower blooming in a quiet pond with soft, realistic lighting" className="w-full aspect-square object-cover rounded-full shadow-2xl border-[8px] md:border-[12px] border-white/80 filter brightness-[0.95] contrast-[1.05]" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAslwA-W6phmVMTgC6NBNyuXA8iKLEMV9bALIZ0DxuQ67O7lhyxpFmJMBcIaZGP8RPSxk0vw5r05-NefIsb5UnSxyXceYvDkmatGSlM1kV_8fEt9TcrVxhDvTKM2-64zpeEvrHPs8YWu3lOkaTTTxKEzA3lt7ztsaEjuIW2W1gQPHOWR7l02J2ziCty9MAYqpmyVyXc5I8SQR5zs62am2QNFrSmI001SgXV61-V11DFxSIcVdbOI5xOOL3Y61p7CB-lxLS76v6ZzZTL" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="up">
              <div className="max-w-4xl mx-auto space-y-10 md:space-y-16">
                <h3 className="font-['Noto_Serif'] text-2xl md:text-5xl leading-tight text-[#1E1E1E] font-bold">
                  Some things don’t need to be reinvented. They need to be remembered.
                </h3>
                <div className="space-y-6 md:space-y-10">
                  <p className="font-['Noto_Serif'] text-xl md:text-4xl leading-[1.6] text-[#1E1E1E] font-medium">
                    Ayurveda doesn’t treat parts. It understands patterns.
                  </p>
                  <p className="font-['Noto_Serif'] text-xl md:text-4xl leading-[1.6] text-[#1E1E1E] font-medium">
                    When your lifestyle falls out of rhythm, your body reflects it.
                  </p>
                </div>
                <p className="font-['Noto_Serif'] text-lg md:text-2xl text-[#2F6F4E] font-bold">
                  Healing begins with understanding.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- CLARITY SECTION --- */}
      <section className="py-20 md:py-48 bg-[#FAF4EB]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
            <div className="col-span-full text-center mb-8 md:mb-16 px-4">
              <ScrollReveal>
                <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl text-[#1E1E1E] font-bold leading-tight">You don’t need more advice. You need clarity.</h3>
              </ScrollReveal>
            </div>
            {[
              { icon: 'medical_services', text: 'You’ll always speak to a real Ayurvedic doctor' },
              { icon: 'search_insights', text: 'We focus on the root cause, not just symptoms' },
              { icon: 'person_celebrate', text: 'Your plan is tailored to your lifestyle' },
              { icon: 'verified', text: 'We guide you with what truly works' },
            ].map((item, i) => (
              <ScrollReveal key={i} direction="up">
                <div className="flex flex-col items-center md:items-start text-center md:text-left hover:-translate-y-2 transition-all duration-500 group px-4">
                  <div className="w-20 h-20 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center mb-6">
                    <span className="material-symbols-outlined text-[#2F6F4E] text-5xl">{item.icon}</span>
                  </div>
                  <h4 className="font-['Noto_Serif'] text-2xl mb-4 text-[#1E1E1E] font-bold">{item.text}</h4>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center">
            <Link to="/about" className="inline-flex items-center gap-2 text-[#2F6F4E] font-bold text-lg md:text-xl hover:underline underline-offset-4">
              See how your consultation works <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
        </div>
      </section>

      {/* --- ROOT MESSAGE SECTION --- */}
      <section className="py-20 md:py-48 bg-[#F5F3EA] overflow-hidden">
        <ScrollReveal>
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row relative items-stretch min-h-[500px] md:min-h-[800px]">
            <div className="flex-1 relative overflow-hidden min-h-[300px] md:min-h-0">
              <img alt="flowing water in a natural stream" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuApstvTz5hzkVEIUvDffEFDyibhAWKoYfTW8oor0FEu6U0TyOg8nbo8YwRNCL8cfdLYuHxJuKXr1fj2M4pHSDTpEMvLEI5j29wtliDCcxcBFs5IWQajuCXpxClmyoykOrxzB_3F9vBk9ThrCqGv8V1GdZ4IUUyH_dog8CvbT0a2bmmm1qccjlzWjlvXTp9pRrA1_j5kYybo81IXLrkStyGqaypOlAAxdZWE35mOKvBe5cTruTwEAQGTMQ1UarJKuaQL8Gfx10p40yrs" />
            </div>
            <div className="flex-1 relative overflow-hidden min-h-[300px] md:min-h-0">
              <img alt="deep complex tree roots in soil" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNTLG-mvDBGL9c16SriGzoKPfTAWvTlJN3dhpVGrO5MtEr02fpyI7YuHwaPTkGqF_ylUoqEs0-wY0ssB5sCzfpjEwD07ApOta0DNHP-zuV71iJAtaIfjsM2-DZECV83FajN22ytpOB1x0Y-EusuTilmvVHRvZylyzKRouDt4xfgfEVLyDQVDT_oV94BdMl-ZsLft1MPdKP5o2DBT7ZNsyLrrKsrrhcNuwylzDpkm9ATXpR1oGWLCk_hYm1-JiLKtdKv1IFIsj-pmwn" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12 text-center z-20 pointer-events-none">
              <div className="max-w-3xl mx-auto bg-white p-10 md:p-20 shadow-2xl pointer-events-auto border border-[#B8C1B6]/10">
                <h3 className="font-['Noto_Serif'] text-2xl md:text-5xl mb-6 md:mb-8 leading-tight text-[#1E1E1E] font-bold">Relief is temporary.<br /><span className="text-[#2F6F4E]">Understanding is permanent.</span></h3>
                <p className="font-['Inter'] text-lg md:text-xl text-[#1E1E1E] leading-relaxed font-bold">Most systems stop at the surface. Ayurveda looks deeper — at the root.</p>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* --- SIGNAL/DISRUPTION/ROOT --- */}
      <section className="py-20 md:py-48 bg-[#FAF4EB] overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-24 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute inset-0 bg-[#2F6F4E]/10 rounded-[2rem] md:rounded-[4rem] rotate-3 scale-105 -z-10"></div>
                <img alt="a peaceful person sitting in a lush green forest in a calm side profile" className="w-full aspect-[4/5] object-cover rounded-[2rem] md:rounded-[4rem] shadow-2xl image-richness border-8 border-white/50" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDpZstdnGwh1H8L1uWWzBAP_A8geILju5Z3AzOW5EArq_cvYDSlFv2qp7QZb8SwbOrJY1X_7o3U-Dx6oSspxWouFL9_P8baYJzbhYYQ2CO6pagxYhE009VbwXWgpE5TwQYx-LCNouP35kRym9Sj9Ssx2pNi_GB-iYuyw7ZA08kU9FHjqrF5GBg8KoA7AXJyoxS3VAgWqdE--GomkmLvV7lcUeMHqJGWgaWJM91fWCJkSieepj7yjenQ2HJqx9kqdxZ61gSSqOGEcyq5" />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="flex flex-col space-y-12 md:space-y-16">
                <h3 className="font-['Noto_Serif'] text-4xl md:text-6xl text-[#1E1E1E] font-bold leading-tight">Signal, Disruption, The Root</h3>
                <div className="space-y-10">
                  <div className="relative pl-12 md:pl-16">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center text-[#2F6F4E] font-bold text-sm">1</div>
                    <h4 className="font-['Noto_Serif'] text-2xl md:text-3xl text-[#2F6F4E] font-bold mb-4">The Signal</h4>
                    <p className="font-['Inter'] text-lg md:text-xl text-[#1E1E1E]/80 leading-relaxed font-bold">Your body is constantly sending signals—fatigue, skin flares, or a racing mind. These aren't accidents; they're whispers.</p>
                  </div>
                  <div className="relative pl-12 md:pl-16">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center text-[#2F6F4E] font-bold text-sm">2</div>
                    <h4 className="font-['Noto_Serif'] text-2xl md:text-3xl text-[#2F6F4E] font-bold mb-4">The Disruption</h4>
                    <p className="font-['Inter'] text-lg md:text-xl text-[#1E1E1E]/80 leading-relaxed font-bold">Stress and environment create disruption in your Dosha balance, moving you away from your natural home state.</p>
                  </div>
                  <div className="relative pl-12 md:pl-16">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center text-[#2F6F4E] font-bold text-sm">3</div>
                    <h4 className="font-['Noto_Serif'] text-2xl md:text-3xl text-[#2F6F4E] font-bold mb-4">The Root</h4>
                    <p className="font-['Inter'] text-lg md:text-xl text-[#1E1E1E]/80 leading-relaxed font-bold">We don't just silence the symptom. We go to the root, using nature's pharmacy to restore the original equilibrium.</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- COMPREHENSIVE CARE SECTION --- */}
      <section className="py-20 md:py-48 bg-[#F5F3EA]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl mb-12 md:mb-20 text-center text-[#1E1E1E] font-bold">Comprehensive Care, Rooted in Nature</h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ScrollReveal direction="left">
              <div className="bg-[#FAF4EB] rounded-[12px] p-6 md:p-8 flex flex-col shadow-sm border border-[#B8C1B6]/10 h-full">
                <div className="mb-8 overflow-hidden rounded-[12px]">
                  <img alt="Fresh Ayurvedic herbs" className="w-full aspect-[4/3] object-cover image-richness" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2-6hucZvlYhi_24mw8bCk2gNE2tqTFrInvYCJi3-ZTHl1aIL5nJV4DWehuTj5TQ4jKvX7gYiA4sySDafsCezMBJhk9wuyjMpgjf3OeFWnuLPpcC759WOlmHQ2RV5YRWbdTyinn4YSrQewwbLgFzAo-0nGl0SZuYO20vf6sbV9luQhFlR45ecjLRMiqdZSCLzmK3iLNFxj1WmamkHVmw5U-tNG1ohxVR0CA07tq_ZzJdnEZiEk5Rr8bCTU-97iKSxqgr1mk6tNPgVW" />
                </div>
                <div className="mt-auto">
                  <h4 className="font-['Noto_Serif'] text-2xl md:text-3xl mb-4 font-bold text-[#1E1E1E]">Deep Dosha Analysis</h4>
                  <p className="font-['Inter'] text-lg text-[#1E1E1E]/80 leading-relaxed font-medium">A comprehensive breakdown of your metabolic type and current energetic deviations.</p>
                </div>
              </div>
            </ScrollReveal>

            <div className="flex flex-col gap-6">
              <ScrollReveal direction="right">
                <div className="bg-[#2F6F4E] text-white rounded-[12px] p-6 md:p-8 flex flex-col justify-between shadow-md h-full">
                  <div>
                    <h4 className="font-['Noto_Serif'] text-2xl md:text-3xl mb-4 font-bold">1:1 Expert Consultation</h4>
                    <p className="font-['Inter'] text-lg mb-8 opacity-90 font-medium">Speak with certified practitioners who listen to your story, not just your symptoms.</p>
                  </div>
                  <button onClick={handleHeroAction} className="bg-[#F5F3EA] text-[#2F6F4E] self-start px-8 py-3 rounded-full font-bold hover:bg-white transition-all flex items-center gap-2">
                    {fromStickyLogo ? 'Go to Dashboard' : (isLoggedIn ? 'Go to Dashboard' : 'Book Now')} <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </ScrollReveal>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScrollReveal direction="up">
                  <div className="bg-[#FAF4EB] rounded-[12px] p-6 md:p-8 flex flex-col shadow-sm border border-[#B8C1B6]/10">
                    <h5 className="font-['Noto_Serif'] text-xl mb-4 font-bold text-[#1E1E1E]">Diet & Lifestyle</h5>
                    <p className="font-['Inter'] text-base text-[#1E1E1E]/80 leading-relaxed font-medium">Customized meal plans that harmonize with your gut.</p>
                  </div>
                </ScrollReveal>
                <ScrollReveal direction="up">
                  <div className="bg-[#FAF4EB] rounded-[12px] p-6 md:p-8 flex flex-col shadow-sm border border-[#B8C1B6]/10">
                    <h5 className="font-['Noto_Serif'] text-xl mb-4 font-bold text-[#1E1E1E]">Herbal Guidance</h5>
                    <p className="font-['Inter'] text-base text-[#1E1E1E]/80 leading-relaxed font-medium">Precisely dosed botanicals for your unique constitution.</p>
                  </div>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CONDITIONS SECTION --- */}
      <section className="py-20 md:py-48 bg-[#F5F3EA]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl mb-12 md:mb-24 text-center text-[#1E1E1E] leading-tight font-bold">Your body isn’t broken.<br /><span className="font-normal italic">It’s been trying to tell you something.</span></h3>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16 md:mb-24">
            {[
              { title: "Skin Condition", desc: "Eczema, acne, inflammation, and recurring skin imbalances" },
              { title: "Sleep & Anxiety", desc: "Disturbed sleep, anxiety, and stress-related imbalances" },
              { title: "Metabolic Health", desc: "Diabetes and blood sugar irregularities" },
              { title: "Joint & Bone Pain", desc: "Osteoarthritis, joint discomfort, and inflammation" }
            ].map((cond, idx) => (
              <ScrollReveal key={idx} direction="up">
                <div className="p-8 md:p-12 rounded-2xl border-2 border-[#B8C1B6]/20 bg-[#FAF4EB]/50 hover:border-[#2F6F4E]/40 hover:bg-[#FAF4EB] transition-all duration-300 group shadow-sm flex flex-col justify-between min-h-[300px] md:min-h-[350px] text-center md:text-left">
                  <div>
                    <h5 className="font-['Noto_Serif'] text-2xl md:text-3xl mb-6 md:mb-8 text-[#1E1E1E] font-bold">{cond.title}</h5>
                    <p className="font-['Inter'] text-[#1E1E1E] leading-relaxed text-lg md:text-xl font-bold">{cond.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal>
            <div className="flex flex-col items-center gap-8">
              {/* <Link to="/about" className="inline-flex items-center gap-2 text-[#2F6F4E] font-bold text-lg md:text-xl hover:underline underline-offset-4">
                View all conditions <span className="material-symbols-outlined">arrow_forward</span>
              </Link> */}
              <button onClick={handleHeroAction} className="bg-[#2F6F4E] text-white px-8 py-4 rounded-xl font-['Noto_Serif'] font-bold text-xl shadow-lg hover:scale-105 transition-transform">
                {fromStickyLogo ? 'Go to Dashboard' : (isLoggedIn ? 'Go to Dashboard' : 'Start Healing for Your Condition')}
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* --- DOCTOR SECTION --- */}
      <section className="py-20 md:py-48 bg-[#F0E9DC]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row gap-16 md:gap-24 items-center">
            <ScrollReveal direction="left">
              <div className="flex-1 text-center md:text-left">
                <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl mb-6 md:mb-10 text-[#1E1E1E] leading-tight font-bold">Not a chatbot.<br /><span className="text-[#2F6F4E]">A real doctor who listens.</span></h3>
                <p className="font-['Inter'] text-xl md:text-2xl text-[#1E1E1E] leading-relaxed mb-10 font-bold">We take time to understand your history, your habits, and your patterns — before we suggest anything.</p>
                <div className="flex justify-center md:justify-start gap-8 md:gap-12 mb-10 md:mb-12">
                  <div>
                    <span className="block font-['Noto_Serif'] text-4xl md:text-5xl text-[#2F6F4E] font-bold mb-2">15+</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">Years Experience</span>
                  </div>
                  <div className="w-px bg-[#B8C1B6]/40 h-12 self-center"></div>
                  <div>
                    <span className="block font-['Noto_Serif'] text-4xl md:text-5xl text-[#2F6F4E] font-bold mb-2">5k+</span>
                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#1E1E1E]">Lives Healed</span>
                  </div>
                </div>
                <button onClick={handleHeroAction} className="inline-flex items-center gap-2 text-[#2F6F4E] font-bold text-lg md:text-xl hover:underline underline-offset-4">
                  {fromStickyLogo ? 'Go to Dashboard' : (isLoggedIn ? 'Go to Dashboard' : 'Meet all doctors')} <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8 w-full max-w-2xl">
                <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start">
                  <img alt="Ayurveda Physician Dr. Ananya Rao" className="w-full max-w-[300px] md:max-w-none aspect-[4/5] object-cover rounded-3xl shadow-xl image-richness border-4 border-white" src={asthaImg} />
                  <div className="px-2 mt-4">
                    <p className="font-['Noto_Serif'] text-xl text-[#1E1E1E] font-bold mb-0">Dr Astha Srivastava</p>
                    <p className="text-[#2F6F4E] font-bold mb-1">BAMS, DRCH</p>
                    <p className="text-sm text-[#1E1E1E] font-bold">3+ years experience</p>
                    <p className="text-xs uppercase tracking-tighter text-[#1E1E1E] font-bold mt-1">Gyenec and obstetrics</p>
                  </div>
                </div>
                <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start mt-4 sm:mt-16">
                  <img alt="Ayurveda Physician Dr. Vikram Shah" className="w-full max-w-[300px] md:max-w-none aspect-[4/5] object-cover rounded-3xl shadow-xl image-richness border-4 border-white" src={abhiImg} />
                  <div className="px-2 mt-4">
                    <p className="font-['Noto_Serif'] text-xl text-[#1E1E1E] font-bold mb-0">Dr Abhishek Bajpai </p>
                    <p className="text-[#2F6F4E] font-bold mb-1">BAMS</p>
                    <p className="text-sm text-[#1E1E1E] font-bold">5+ years experience</p>
                    <p className="text-xs uppercase tracking-tighter text-[#1E1E1E] font-bold mt-1">Panchkarma & Skin Disorders</p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- HEALING PHILOSOPHY SECTION --- */}
      <section className="py-20 md:py-48 bg-[#F5F3EA]">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <ScrollReveal direction="left">
              <div className="order-2 md:order-1 text-center md:text-left">
                <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl mb-6 md:mb-10 text-[#1E1E1E] leading-tight font-bold">Healing happens in daily life.</h3>
                <p className="font-['Inter'] text-xl md:text-2xl text-[#1E1E1E] leading-relaxed mb-6 font-bold">The way you wake up. The way you eat. The way you move. These are not small things. They are your treatment.</p>
                <p className="font-['Inter'] text-lg md:text-xl text-[#1E1E1E] leading-relaxed mb-10 font-medium md:mt-8">When you commit fully to the routine, your body begins to heal in ways you can feel.</p>
                <Link to="/about" className="inline-flex items-center gap-2 text-[#2F6F4E] font-bold text-lg md:text-xl hover:underline underline-offset-4">
                  Explore lifestyle guidance <span className="material-symbols-outlined">arrow_forward</span>
                </Link>
              </div>
            </ScrollReveal>
            <ScrollReveal direction="right">
              <div className="order-1 md:order-2 rounded-3xl overflow-hidden shadow-2xl">
                <img alt="peaceful person practicing yoga in a lush green landscape at sunrise" className="w-full h-[400px] md:h-[600px] object-cover image-richness" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm3nDCimDgHO0Yi0H2_EBbqhlnQV6it-1Dp09Tn-ovtRDixj4x_Avllg8hR99LcpaEChyy_LA43Tq7wwHFe2UeOjQUkX_ZeGSFIrgX1E8Jb7xc4il9BQgyBPorrtMIItBiz1k4CLqkPSv_peTI-ukfFHmDVGElFVAryyVFjAZSdQjpN2T6nCKUq6OKUXjJyff8mBLz0F7Yti_lI71xDdZw0HGmYYOya7gcdTUZR5lFycWYDznfOrk6EpIpG1L6KhItFuifsETQODMp" />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="py-20 md:py-32 bg-[#FAF4EB] border-y border-[#B8C1B6]/10">
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h3 className="font-['Noto_Serif'] text-3xl md:text-5xl text-[#1E1E1E] font-bold mb-4">The Herbarium</h3>
              <p className="font-['Inter'] text-xl text-[#1E1E1E]/70 max-w-2xl mx-auto">Latest insights on holistic healing and ancient wellness practices.</p>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center mb-12">
            {websiteBlogs.slice(0, 3).map((blog, idx) => (
              <ScrollReveal key={blog.id} direction="up">
                <Link to={`/blogs/${blog.id}`} className="bg-white rounded-[24px] border border-[#B8C1B6]/10 shadow-sm overflow-hidden group cursor-pointer flex flex-col h-full hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden">
                    <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <p className="text-[10px] font-bold text-[#C8A96A] uppercase tracking-widest mb-3">{blog.category}</p>
                    <h3 className="font-['Noto_Serif'] text-xl font-bold text-[#1E1E1E] mb-4 line-clamp-2">{blog.title}</h3>
                    <p className="font-['Inter'] text-sm text-[#1E1E1E]/80 mb-6 line-clamp-3">{blog.excerpt}</p>
                    <button className="mt-auto text-sm font-bold text-[#2F6F4E] flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Article <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center">
            <Link to="/blogs" className="border-2 border-[#2F6F4E] text-[#2F6F4E] hover:bg-[#2F6F4E] hover:text-white px-8 py-3 rounded-full font-bold transition-all inline-block">
              View All Articles
            </Link>
          </div>
        </div>
      </section>

      {/* --- COMMITMENT SECTION --- */}
      <section className="py-20 md:py-48 bg-[#F5F3EA] border-y border-[#B8C1B6]/10">
        <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
          <ScrollReveal direction="up">
            <div className="flex flex-col items-center mb-8 md:mb-12">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#2F6F4E]/10 flex items-center justify-center mb-6">
                <img alt="AyurCare360 Logo" className="w-full h-full object-cover p-1 rounded-full" src="/Favicon_up.png" />
              </div>
              <div className="w-24 h-[3px] bg-[#2F6F4E]/30"></div>
            </div>
            <h3 className="font-['Noto_Serif'] text-3xl md:text-6xl mb-6 md:mb-8 text-[#1E1E1E] font-bold leading-tight">Healing works — when you do.</h3>
            <p className="font-['Inter'] text-lg md:text-2xl text-[#1E1E1E] leading-relaxed mb-4 md:mb-6 font-bold italic">Consistency and honesty with your routine change everything.</p>
            <p className="font-['Noto_Serif'] text-xl md:text-3xl text-[#2F6F4E] mb-6 md:mb-8 font-bold">प्रकृति के साथ, संतुलन की ओर</p>
            <p className="font-['Inter'] text-base md:text-xl text-[#1E1E1E] leading-relaxed mb-8 md:mb-12 max-w-3xl mx-auto font-bold">Your body already knows how to heal. It just needs your absolute discipline and awareness to return to its natural state.</p>
            <div className="w-24 md:w-32 h-[2px] bg-[#2F6F4E] mx-auto"></div>
          </ScrollReveal>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-12 md:py-16 bg-[#2F6F4E] text-white relative overflow-hidden px-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-white/10 rounded-full blur-[60px] md:blur-[120px]"></div>
          <div className="absolute -bottom-24 -right-24 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-black/10 rounded-full blur-[60px] md:blur-[120px]"></div>
        </div>
        <ScrollReveal>
          <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center relative z-10 px-4">
            <h2 className="font-['Noto_Serif'] text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 max-w-4xl leading-tight font-bold">Start with one conversation.<br /><span className="italic font-normal opacity-90">It might change everything.</span></h2>
            <p className="font-['Inter'] text-base md:text-xl mb-6 md:mb-8 text-white font-bold max-w-2xl">Talk to a doctor who understands your body — not just your symptoms.</p>
            <div className="flex flex-col items-center gap-4 mb-8 md:mb-10 w-full">
              <button onClick={handleHeroAction} className="bg-[#F5F3EA] text-[#1E1E1E] hover:bg-white w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-xl font-['Noto_Serif'] text-lg md:text-2xl shadow-2xl transition-all transform hover:-translate-y-1 active:scale-95 font-bold border-2 border-transparent">
                {fromStickyLogo ? 'Go to Dashboard' : (isLoggedIn ? 'Go to Dashboard' : 'Book My Consultation')}
              </button>
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-white/80">Limited consultation slots available</p>
            </div>
            <p className="font-['Inter'] text-sm md:text-lg opacity-90 text-white font-bold">Private. Personal. No pressure.</p>
          </div>
        </ScrollReveal>
      </section>

      {/* --- TAGLINE SECTION --- */}
      <section className="py-12 bg-[#F3EDE3] text-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-4">
            <img
              alt="AyurCare360 Logo"
              className="w-8 h-8 object-cover p-1 rounded-full bg-white shadow-sm"
              src="/Favicon_up.png"
            />
            <span className="material-symbols-outlined text-[#376645] text-2xl">history_edu</span>
          </div>
          <p className="font-['Noto_Serif'] italic text-xl md:text-3xl text-[#376645]">Built by doctors. Guided by honesty.</p>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full bg-[#F3EDE3] border-t border-[#376645]/10 pt-8 pb-16 px-6">
        <div className="max-w-screen-xl mx-auto flex flex-col items-center text-center px-4">
          {/* Logo */}
          <div className="mb-8 md:mb-10">
            <span className="text-2xl md:text-3xl font-['Noto_Serif'] italic text-[#376645] font-bold">AyurCare 360</span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 md:gap-x-12 gap-y-4 mb-8">
            <Link to="/blogs" className="text-[#376645] font-['Inter'] text-sm md:text-base font-medium hover:opacity-70 transition-opacity">The Herbarium</Link>
            {/* <Link to="/about" className="text-[#376645] font-['Inter'] text-sm md:text-base font-medium hover:opacity-70 transition-opacity">Dosha Quiz</Link> */}
            <Link to="/privacy" className="text-[#376645] font-['Inter'] text-sm md:text-base font-medium hover:opacity-70 transition-opacity">Privacy Policy</Link>
            <Link to="/login" className="text-[#376645] font-['Inter'] text-sm md:text-base font-medium hover:opacity-70 transition-opacity">Practitioner Login</Link>
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-10">
            <a href="https://www.facebook.com/share/18TNZK4jCS/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#376645] hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>

            <a href="https://www.instagram.com/ayurcare.360?igsh=Nm45MTBrbnk3ZG9z" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#376645] hover:opacity-70 transition-opacity">
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
          {/* Copyright */}
          <div className="max-w-2xl">
            <p className="text-[#376645] font-['Inter'] text-xs md:text-sm leading-relaxed opacity-90">
              © {new Date().getFullYear()} AyurCare 360. Guided by tradition, lead by doctors. Every leaf tells a story of healing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;