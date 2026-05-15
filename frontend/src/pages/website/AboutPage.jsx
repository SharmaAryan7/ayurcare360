import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, Activity, Heart, ShieldCheck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">

      {/* 1. Public Navigation Bar (Consistent with Contact Page) */}
      <nav className="flex items-center justify-between py-6 px-8 md:px-16 max-w-7xl mx-auto w-full gap-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-[#3A6447] tracking-tight shrink-0">
          <Leaf size={28} /> AyurCare360
        </Link>

        <div className="hidden md:block relative w-full max-w-2xl mx-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search wellness topics, doctors, or products..."
            className="w-full bg-white border border-[#EFEBE1] rounded-full py-3.5 pl-12 pr-6 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/30 shadow-sm transition-all"
          />
        </div>

        <Link
          to="/login"
          className="bg-[#3A6447] hover:bg-[#2C4D36] text-white text-sm font-bold py-3.5 px-8 rounded-full transition-colors shadow-sm shrink-0"
        >
          Login / SignUp
        </Link>
      </nav>

      {/* 2. Main Content Area */}
      <main className="flex-1 w-full">

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-8 md:px-16 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="text-[11px] font-bold text-[#3A6447] uppercase tracking-widest mb-4">Our Story</p>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                About Ayurcare360
              </h1>
              <p className="text-lg font-medium text-gray-600 leading-relaxed">
                Ayurcare360 is a digital Ayurveda healthcare platform connecting patients with verified Ayurvedic doctors for online Ayurvedic consultations in India.
                Our goal is to make authentic Ayurvedic treatment online accessible, structured, and effective for modern lifestyles.
              </p>
            </div>
            <div className="relative h-[400px] rounded-[40px] overflow-hidden shadow-xl border border-[#EFEBE1]">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=1200"
                alt="Ayurvedic herbs and holistic healing"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 3 Pillars / Values Section */}
        <section className="bg-white border-y border-[#EFEBE1] py-20">
          <div className="max-w-7xl mx-auto px-8 md:px-16">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
                Bridging Ancient Wisdom & Modern Technology
              </h2>
              <p className="text-base font-medium text-gray-500 leading-relaxed">
                We combine traditional Ayurvedic wisdom with modern technology to deliver personalized treatment plans, Prakriti analysis, and holistic health guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#E7F3EB] text-[#3A6447] flex items-center justify-center mb-6">
                  <Activity size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Holistic Guidance</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  Patients receive expert advice on herbal treatments, diet, and lifestyle while tracking their wellness journey digitally.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#FDF1E8] text-[#D9774B] flex items-center justify-center mb-6">
                  <Heart size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Seamless Care</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  We simplify diagnosis by enabling seamless consultations, structured patient records, and continuous follow-ups.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#FAF7F2] rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#F3E8FF] text-[#9333EA] flex items-center justify-center mb-6">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Complete Healing</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  Whether it’s preventive care or managing chronic conditions, our platform supports complete natural healing through Ayurveda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Vision Highlight Box */}
        <section className="max-w-7xl mx-auto px-8 md:px-16 py-20">
          <div className="bg-[#3A6447] rounded-[40px] p-12 md:p-20 text-center relative overflow-hidden shadow-sm">
            {/* Decorative background circle */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -ml-20 -mb-20 blur-3xl"></div>

            <div className="relative z-10 max-w-4xl mx-auto">
              <Leaf className="text-white/80 mx-auto mb-6" size={40} />
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-8">
                "We are building a trusted ecosystem where holistic healthcare and modern digital tools come together to create a 360° wellness experience."
              </h2>
              <Link
                to="/contact"
                className="inline-block bg-white text-[#3A6447] hover:bg-[#FDF9EE] font-bold py-4 px-10 rounded-full transition-colors shadow-sm"
              >
                Join Our Ecosystem
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* 3. Footer Area (Consistent with other pages) */}
      <footer className="border-t border-[#EFEBE1] bg-white py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-[#3A6447] tracking-tight">
            <Leaf size={28} /> AyurCare360
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/about" className="text-[#3A6447] transition-colors">About</Link>
            <Link to="/help" className="hover:text-[#3A6447] transition-colors">Help Desk</Link>
            <Link to="/blogs" className="hover:text-[#3A6447] transition-colors">Blogs</Link>
            <Link to="/contact" className="hover:text-[#3A6447] transition-colors">Contact Us</Link>
            <Link to="/privacy" className="hover:text-[#3A6447] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#3A6447] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default AboutPage;