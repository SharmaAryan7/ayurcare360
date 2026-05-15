import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, ChevronDown, Calendar, CreditCard, Stethoscope } from 'lucide-react';

// Reusable Accordion Item Component
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-[#EFEBE1] py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left focus:outline-none group"
      >
        <span className="text-sm font-bold text-gray-900 group-hover:text-[#3A6447] transition-colors">{question}</span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pt-4 text-sm font-medium text-gray-600 leading-relaxed animate-in slide-in-from-top-2 whitespace-pre-line">
          {answer}
        </div>
      )}
    </div>
  );
};

const HelpDeskPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">

      {/* 1. Public Navigation Bar */}
      <nav className="flex items-center justify-between py-6 px-8 md:px-16 max-w-7xl mx-auto w-full gap-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-[#3A6447] tracking-tight shrink-0">
          <Leaf size={28} /> AyurCare360
        </Link>

        <div className="hidden md:block relative w-full max-w-2xl mx-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for help..."
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

      {/* 2. Main Content */}
      <main className="flex-1 max-w-3xl mx-auto px-8 py-16 lg:py-24 w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Help Desk</h1>
          <p className="text-lg font-medium text-gray-500">Find answers to common questions and get support.</p>
        </div>

        <div className="space-y-12 mb-16">
          {/* Section: Appointments */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="text-[#3A6447]" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Appointments</h2>
            </div>
            <div className="bg-white rounded-3xl p-6 px-8 border border-[#EFEBE1] shadow-sm">
              <FAQItem
                question="How can I book an online Ayurvedic consultation?"
                answer="You can easily book a consultation by selecting a doctor, choosing a suitable time slot, and completing the payment. Once booked, you will receive confirmation details for your session."
              />
              <FAQItem
                question="Do I need to create an account to book a consultation?"
                answer="Yes, creating an account helps you manage appointments, access consultation history, and track your wellness journey."
              />
              <FAQItem
                question="What if I need follow-up consultations?"
                answer="You can easily book follow-up consultations with the same doctor to track your progress and adjust your treatment plan."
              />
              <FAQItem
                question="What is the refund policy for consultations?"
                answer="Refunds are provided if the doctor cancels the appointment or if technical issues prevent the consultation. Missed or late appointments may not be eligible for refunds."
              />
            </div>
          </div>

          {/* Section: Payments & Orders */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-[#D9774B]" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Orders & Payments</h2>
            </div>
            <div className="bg-white rounded-3xl p-6 px-8 border border-[#EFEBE1] shadow-sm">
              <FAQItem
                question="Can I order Ayurvedic medicines through Ayurcare360?"
                answer="Yes, you can order recommended Ayurvedic products through the platform. Delivery timelines may vary based on your location."
              />
              <FAQItem
                question="How long does delivery take for products?"
                answer={"Orders are usually delivered within:\n• 3–5 business days in metro cities\n• 5–7 business days in other locations"}
              />
            </div>
          </div>

          {/* Section: Consultations */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Stethoscope className="text-[#9333EA]" size={20} />
              <h2 className="text-xl font-bold text-gray-900">Consultations & General</h2>
            </div>
            <div className="bg-white rounded-3xl p-6 px-8 border border-[#EFEBE1] shadow-sm">
              <FAQItem
                question="What is Ayurcare360?"
                answer="Ayurcare360 is a digital Ayurveda healthcare platform where you can consult verified Ayurvedic doctors online and receive personalized treatment plans, lifestyle guidance, and holistic wellness support."
              />
              <FAQItem
                question="Are the doctors on Ayurcare360 qualified?"
                answer="Yes, all doctors on Ayurcare360 are verified Ayurvedic practitioners with relevant qualifications and experience."
              />
              <FAQItem
                question="What health issues can Ayurveda help with?"
                answer="Ayurveda focuses on holistic healing and can help with lifestyle disorders, digestion issues, stress, skin problems, hormonal imbalances, and chronic conditions. For serious medical concerns, consult a licensed medical professional."
              />
              <FAQItem
                question="Will I get a personalized treatment plan?"
                answer="Yes, doctors provide customized treatment plans based on your Prakriti (body type), symptoms, and health history. This may include herbal remedies, diet plans, and lifestyle recommendations."
              />
              <FAQItem
                question="Is online consultation effective in Ayurveda?"
                answer="Yes, online consultations are effective for many conditions, especially for lifestyle management, preventive care, and follow-ups. Doctors assess your condition through detailed discussions and health information."
              />
              <FAQItem
                question="How do I receive my prescription or treatment plan?"
                answer="After your consultation, your treatment plan and recommendations will be shared digitally through the platform."
              />
              <FAQItem
                question="Are Ayurvedic treatments safe?"
                answer="Ayurvedic treatments are generally natural and safe when prescribed by qualified practitioners. However, it is important to follow the doctor’s guidance carefully."
              />
              <FAQItem
                question="Can I consult from anywhere in India?"
                answer="Yes, Ayurcare360 allows you to connect with Ayurvedic doctors online from anywhere in India."
              />
              <FAQItem
                question="Is my personal and health data सुरक्षित (secure)?"
                answer="Yes, Ayurcare360 uses secure systems and follows data protection practices to keep your personal and health information safe."
              />
            </div>
          </div>
        </div>

        {/* Still Need Help Box - Now Full Width! */}
        <div className="mt-16 bg-white rounded-3xl p-10 text-center border border-[#EFEBE1] shadow-sm w-full mb-10">
          <h3 className="text-xl font-bold text-gray-900 mb-3">Still need help?</h3>
          <p className="text-sm font-medium text-gray-500 mb-8 leading-relaxed">
            Our support team is available 24/7 to assist you with any further inquiries.
          </p>
          <Link to="/contact" className="inline-block bg-[#3A6447] hover:bg-[#2C4D36] text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-sm text-sm">
            Contact Support
          </Link>
        </div>
      </main>

      {/* 3. Footer Area */}
      <footer className="border-t border-[#EFEBE1] bg-white py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-[#3A6447] tracking-tight">
            <Leaf size={28} /> AyurCare360
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/about" className="hover:text-[#3A6447] transition-colors">About</Link>
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

export default HelpDeskPage;