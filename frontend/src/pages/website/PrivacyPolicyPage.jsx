import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search } from 'lucide-react';

const PrivacyPolicyPage = () => {
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

        {/* --- PRIVACY POLICY SECTION --- */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">Last Updated: March 2026</p>

        <p className="text-lg font-medium text-gray-600 leading-relaxed mb-12 border-l-4 border-[#3A6447] pl-6">
          Welcome to Ayurcare360, a digital Ayurveda healthcare platform providing online Ayurvedic consultations, personalized treatment plans, and holistic wellness solutions in India. We are committed to protecting your personal and health information.
        </p>

        <div className="space-y-12 mb-20">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              We may collect the following types of information:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Personal Information</h3>
                <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-1 list-disc pl-5">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Address</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Health Information</h3>
                <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-1 list-disc pl-5">
                  <li>Symptoms shared during consultations</li>
                  <li>Medical history voluntarily provided</li>
                  <li>Consultation records and treatment details</li>
                </ul>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Transaction Information</h3>
                <p className="text-sm font-medium text-gray-600 leading-relaxed">
                  Order details and payment confirmations. (Note: We do not store full card details. Payments are processed through secure third-party gateways.)
                </p>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-800 mb-2">Technical Information</h3>
                <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-1 list-disc pl-5">
                  <li>IP address</li>
                  <li>Device and browser details</li>
                  <li>Cookies and analytics data</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              Your information is used to:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>Provide online Ayurvedic doctor consultations in India</li>
              <li>Deliver personalized treatment plans and wellness programs</li>
              <li>Process orders and manage deliveries</li>
              <li>Improve platform performance and user experience</li>
              <li>Send appointment updates and notifications</li>
              <li>Provide customer support</li>
            </ul>
            <p className="text-sm font-bold text-[#3A6447] bg-[#E7F3EB] inline-block px-4 py-2 rounded-lg">
              We do not sell or rent your personal data to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Data Protection & Security</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              We implement industry-standard security measures, including encryption, secure servers, and restricted data access, to safeguard your personal and health information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Retention</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              We retain your data only for as long as necessary to provide services and comply with legal obligations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Rights</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              You may request:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>Access to your personal data</li>
              <li>Correction of inaccurate information</li>
              <li>Deletion of your data</li>
            </ul>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              To exercise these rights, contact us at: <a href="mailto:support@ayurcare360.com" className="text-[#3A6447] font-bold hover:underline">support@ayurcare360.com</a>
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Cookies & Analytics</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              We use cookies and analytics tools to enhance user experience, analyze platform performance, and improve our services. You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Compliance</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Ayurcare360 complies with applicable laws including the Digital Personal Data Protection Act (India) and follows standard data protection practices.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-[#EFEBE1] shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-4">8. Contact Information</h2>
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

        {/* --- REFUND & SHIPPING POLICY SECTION --- */}
        <hr className="border-[#EFEBE1] mb-16" />

        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Refund & Shipping Policy</h1>
        <p className="text-lg font-medium text-gray-600 leading-relaxed mb-12 border-l-4 border-[#D9774B] pl-6">
          At Ayurcare360, we aim to provide a smooth and reliable experience for both consultations and product deliveries.
        </p>

        <div className="space-y-12 mb-16">

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Consultation Refund Policy</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              Refunds may be issued in the following cases:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>The practitioner cancels the appointment</li>
              <li>Technical issues prevent the consultation from taking place</li>
            </ul>
            <p className="text-sm font-medium text-[#D92D20] bg-[#FEE4E2]/50 inline-block px-4 py-2 rounded-lg">
              Missed appointments or late cancellations may not be eligible for refunds.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Product Refund Policy</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              Refunds or replacements are accepted if:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li>The product is damaged during delivery</li>
              <li>The wrong product is delivered</li>
            </ul>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Requests must be submitted within <strong>48 hours</strong> of receiving the product.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Non-Refundable Items</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed mb-4">
              Refunds are not applicable for:
            </p>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5">
              <li>Opened or used products</li>
              <li>Requests made after the return window</li>
            </ul>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white p-6 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-2">4. Refund Processing</h2>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                Approved refunds are processed within 5–7 business days to the original payment method.
              </p>
            </section>

            <section className="bg-white p-6 rounded-2xl border border-[#EFEBE1] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-2">5. Order Processing</h2>
              <p className="text-sm font-medium text-gray-600 leading-relaxed">
                Orders are processed within 1–2 business days after payment confirmation.
              </p>
            </section>
          </div>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Delivery Timeline</h2>
            <ul className="text-sm font-medium text-gray-600 leading-relaxed space-y-2 list-disc pl-5 mb-4">
              <li><strong>Metro cities:</strong> 3–5 business days</li>
              <li><strong>Other locations:</strong> 5–7 business days</li>
            </ul>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Delivery times may vary depending on courier services and location.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Shipping Charges</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Shipping charges may apply depending on order value and delivery location. Promotional offers may include free shipping.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Order Tracking</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Tracking details will be shared via email or SMS once your order is dispatched.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Shipping Disclaimer</h2>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Ayurcare360 is not responsible for delays caused by courier partners or incorrect address details provided by users.
            </p>
          </section>

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

export default PrivacyPolicyPage;