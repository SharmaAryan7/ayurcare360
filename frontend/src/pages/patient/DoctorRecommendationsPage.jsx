import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, GraduationCap, Languages, ArrowRight } from 'lucide-react';

const DoctorRecommendationsPage = () => {
    const navigate = useNavigate();

    return (
        <div className="bg-[#FAF7F2] text-gray-900 min-h-screen font-sans">

            <header className="w-full pt-12 pb-8">
                <div className="flex flex-col items-center text-center">
                    <span className="text-lg font-bold tracking-[0.2em] text-[#3A6447] mb-4 uppercase">AyurCare360</span>
                    <div className="w-16 h-16 rounded-full overflow-hidden border border-[#EFEBE1] p-1 bg-white shadow-sm">
                        <img alt="AyurCare360 logo" className="w-full h-full object-contain rounded-full" src="/Favicon_up.png" />
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 pb-32">
                <section className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">Recommended for you</h1>
                    <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto mb-4">
                        Based on your symptoms <span className="text-[#3A6447] font-bold">(Sleep / Anxiety)</span>, we've matched you with the most suitable Ayurvedic experts.
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest py-4 inline-block px-8">
                        "Your healing journey is unique. These practitioners are aligned with your needs."
                    </p>
                </section>

                <section className="mb-12">
                    <div className="bg-white rounded-[32px] overflow-hidden flex flex-col md:flex-row shadow-sm border border-[#EFEBE1] hover:shadow-md transition-shadow duration-500">
                        <div className="md:w-2/5 relative h-72 md:h-auto">
                            <img className="w-full h-full object-cover" alt="Dr. Ananya Sharma" src="https://images.unsplash.com/photo-1594824416965-4f51e06d2036?auto=format&fit=crop&q=80&w=400" />
                            <div className="absolute top-4 left-4 bg-white text-[#3A6447] border border-[#EFEBE1] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">Featured Expert</div>
                        </div>

                        <div className="p-8 md:p-10 flex flex-col justify-between md:w-3/5">
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dr. Ananya Sharma</h2>
                                    <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-1 rounded-lg">
                                        <Star size={14} className="fill-current" />
                                        <span className="ml-1 text-sm font-bold text-yellow-700">4.9</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 font-bold text-sm mb-4">Stress & Sleep Management</p>
                                <div className="flex flex-wrap gap-y-3 gap-x-6 mb-8 text-sm text-gray-500 font-medium">
                                    <div className="flex items-center gap-2">
                                        <GraduationCap size={18} className="text-[#3A6447]" />
                                        <span>15+ years experience</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Languages size={18} className="text-[#3A6447]" />
                                        <span>English, Hindi, Sanskrit</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-[#EFEBE1] gap-6">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Consultation Fee</p>
                                    <p className="text-2xl font-extrabold text-[#3A6447]">₹1200</p>
                                </div>
                                <div className="flex flex-col items-center">
                                    <button onClick={() => navigate('/patient/book-appointment')} className="bg-[#3A6447] hover:bg-[#2C4D36] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-sm">
                                        Check Availability
                                    </button>
                                    <span className="mt-2 text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
                                        Limited slots today
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    <div className="bg-white rounded-[32px] p-6 flex flex-col border border-[#EFEBE1] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF7F2]">
                                <img className="w-full h-full object-cover" alt="Dr. Vikram Mehra" src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Dr. Vikram Mehra</h3>
                                <p className="text-[11px] text-[#3A6447] font-bold uppercase tracking-widest">Internal Medicine</p>
                                <div className="flex items-center text-yellow-500 text-xs mt-2">
                                    <Star size={12} className="fill-current" />
                                    <span className="ml-1 font-bold text-yellow-700">4.8</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8 flex-grow">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Experience</span>
                                <span className="font-bold text-gray-900">10 years</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Languages</span>
                                <span className="font-bold text-gray-900">English, Hindi</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Fee</span>
                                <span className="font-extrabold text-[#3A6447]">₹1000</span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/patient/book-appointment')} className="w-full bg-[#FAF7F2] hover:bg-[#3A6447] hover:text-white text-[#3A6447] py-3.5 rounded-full font-bold text-sm transition-colors">
                            Check Availability
                        </button>
                    </div>

                    <div className="bg-white rounded-[32px] p-6 flex flex-col border border-[#EFEBE1] shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-[#FAF7F2]">
                                <img className="w-full h-full object-cover" alt="Dr. Priya Iyer" src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=200" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Dr. Priya Iyer</h3>
                                <p className="text-[11px] text-[#3A6447] font-bold uppercase tracking-widest">Holistic Wellness</p>
                                <div className="flex items-center text-yellow-500 text-xs mt-2">
                                    <Star size={12} className="fill-current" />
                                    <span className="ml-1 font-bold text-yellow-700">4.7</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 mb-8 flex-grow">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Experience</span>
                                <span className="font-bold text-gray-900">8 years</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Languages</span>
                                <span className="font-bold text-gray-900">English, Tamil</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 font-medium">Fee</span>
                                <span className="font-extrabold text-[#3A6447]">₹900</span>
                            </div>
                        </div>

                        <button onClick={() => navigate('/patient/book-appointment')} className="w-full bg-[#FAF7F2] hover:bg-[#3A6447] hover:text-white text-[#3A6447] py-3.5 rounded-full font-bold text-sm transition-colors">
                            Check Availability
                        </button>
                    </div>
                </section>

                <section className="flex flex-col items-center gap-8">
                    <Link to="/patient/book-appointment" className="group flex items-center gap-2 text-[#3A6447] font-bold text-sm uppercase tracking-widest hover:gap-4 transition-all">
                        View More Experts
                        <ArrowRight size={18} />
                    </Link>
                    <button onClick={() => navigate('/patient/dashboard')} className="text-gray-500 hover:text-gray-900 text-sm font-bold transition-colors pb-0.5">
                        Continue to Dashboard
                    </button>
                </section>
            </main>
        </div>
    );
};

export default DoctorRecommendationsPage;