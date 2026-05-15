import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search } from 'lucide-react';

const TermsConditionsPage = () => {
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

      {/* 2. Main Content */}
      <main className="flex-1 max-w-4xl mx-auto px-8 md:px-16 py-16 lg:py-24 w-full">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Terms & Conditions</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Last Updated: March 2026</p>

        <p className="text-lg font-medium text-gray-600 leading-relaxed mb-12 border-l-4 border-[#3A6447] pl-6">
          Welcome to Ayurcare360, a digital Ayurveda healthcare platform providing online Ayurvedic consultations, personalized treatment plans, wellness programs, and Ayurvedic products across India. By accessing or using our platform, you agree to the following Terms & Conditions.
        </p>

        <div className="space-y-12 mb-16">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              By using Ayurcare360, you confirm that you have read, understood, and agreed to these Terms & Conditions, along with our Privacy Policy and Refund & Shipping Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Provided</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              Ayurcare360 offers:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>Online Ayurvedic doctor consultations</li>
              <li>Personalized treatment plans and lifestyle guidance</li>
              <li>Wellness programs based on Ayurvedic principles</li>
              <li>Ayurvedic products and related services</li>
            </ul>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              All services are intended for general wellness and holistic healthcare support.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Responsibilities</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              By using the platform, you agree to:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Provide accurate and complete information</li>
              <li>Use the platform for lawful purposes only</li>
              <li>Not misuse consultation services or platform features</li>
              <li>Follow all applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Medical Disclaimer</h2>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>Services on Ayurcare360 are based on Ayurvedic principles and are intended for wellness guidance only</li>
              <li>They do not replace professional medical diagnosis, treatment, or emergency care</li>
              <li>Ayurcare360 does not guarantee specific health outcomes</li>
              <li>Users should consult qualified healthcare professionals for serious medical conditions</li>
            </ul>
            <p className="text-sm font-medium text-[#D92D20] bg-[#FEE4E2]/50 inline-block px-4 py-2 rounded-lg">
              Use of the platform is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Appointments & Consultations</h2>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Consultations are scheduled based on doctor availability</li>
              <li>Users are responsible for attending appointments on time</li>
              <li>Missed or late appointments may not be eligible for refunds (as per Refund Policy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Payments</h2>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>All services and product purchases require payment confirmation before processing</li>
              <li>Payments are handled via secure third-party payment gateways</li>
              <li>Ayurcare360 does not store complete payment card details</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              All content on Ayurcare360, including text, design, logos, graphics, and platform features, is the property of Ayurcare360 and is protected by applicable intellectual property laws.
            </p>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              You may not copy, reproduce, or distribute any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              Ayurcare360 shall not be held liable for:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>Misinterpretation or misuse of consultation advice</li>
              <li>Any health outcomes resulting from treatments or products</li>
              <li>Allergic reactions or side effects</li>
              <li>Delays caused by third-party service providers</li>
            </ul>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              In any case, liability shall be limited to the amount paid by the user for the specific service or product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Third-Party Services</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Ayurcare360 may use third-party services such as payment gateways and logistics partners. We are not responsible for issues arising from these third-party services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination of Use</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              We reserve the right to suspend or terminate access to the platform if:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Terms are violated</li>
              <li>Fraudulent or abusive behavior is detected</li>
              <li>Misuse of services occurs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Ayurcare360 may update these Terms & Conditions at any time. Continued use of the platform after changes indicates your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Punjab, India.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-[#EFEBE1] shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              <strong>Ayurcare360</strong><br />
              Mahatma Hans Raj Marg, Dayanand Nagar<br />
              Jalandhar, Punjab 144008<br />
              India
            </p>
            <p className="text-sm font-medium text-gray-600">
              📧 Email: <a href="mailto:support@ayurcare360.com" className="text-[#3A6447] font-bold hover:underline">support@ayurcare360.com</a>
            </p>
          </section>

        </div>

        <div className="mt-12 bg-[#E7F3EB] p-6 rounded-2xl border border-[#C2D1C7] text-center">
          <p className="text-sm font-bold text-[#2C4D36]">
            By using Ayurcare360, you acknowledge that you have read, understood, and agreed to these Terms & Conditions.
          </p>
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

export default TermsConditionsPage;