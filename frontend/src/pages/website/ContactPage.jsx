import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Instagram, Facebook, Send, CheckCircle } from 'lucide-react';

const ContactPage = () => {
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Your receiving email address
    const targetEmail = "sharmaaryan3820@gmail.com";

    // Construct the mailto link
    const mailtoLink = `mailto:${targetEmail}?subject=New Contact Inquiry from ${encodeURIComponent(name)}&body=Name: ${encodeURIComponent(name)}%0D%0AEmail: ${encodeURIComponent(email)}%0D%0A%0D%0AMessage:%0D%0A${encodeURIComponent(message)}`;

    // Open default mail client
    window.location.href = mailtoLink;

    // Clear the form fields
    e.target.reset();

    // Show Success Toast
    setShowToast(true);

    // Hide Toast after 3 seconds
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <div className="bg-[#FAF7F2] text-gray-900 flex flex-col min-h-screen font-sans relative">

      {/* SUCCESS TOAST NOTIFICATION */}
      <div
        className={`fixed top-6 right-6 z-50 flex items-center gap-3 bg-white border border-[#EFEBE1] shadow-lg rounded-2xl px-6 py-4 transform transition-all duration-500 ease-in-out ${showToast ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'
          }`}
      >
        <CheckCircle className="text-[#3A6447]" size={24} />
        <div>
          <p className="text-sm font-bold text-gray-900">Message Prepared!</p>
          <p className="text-xs font-medium text-gray-500">Your email client has been opened.</p>
        </div>
      </div>

      <nav className="w-full bg-transparent px-6 py-6 border-b border-[#EFEBE1]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between md:px-10">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-white border border-[#EFEBE1] flex items-center justify-center">
                <img alt="AyurCare360 Logo" className="w-full h-full object-cover rounded-full" src="/Favicon_up.png" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#3A6447]">AyurCare360</span>
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow max-w-[1600px] mx-auto px-6 py-12 md:py-24 w-full md:px-16">
        <header className="flex flex-col items-center mb-20 text-center">
          <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">Contact us</h2>
          <p className="text-lg md:text-xl font-medium text-gray-600 max-w-xl mx-auto">
            We’re here to support you—reach out anytime.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">

          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#EFEBE1] shadow-sm">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-[#FAF7F2] rounded-2xl text-[#3A6447]">
                  <MessageCircle size={32} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Talk to a real person</h3>
                  <p className="text-gray-500 font-medium text-sm mb-8">24/7 support available for your wellness journey.</p>
                  <a
                    className="inline-flex items-center justify-center bg-[#3A6447] hover:bg-[#2C4D36] text-white px-8 py-4 rounded-full font-bold text-sm transition-colors shadow-sm"
                    href="https://wa.me/919236313005"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-10 rounded-[32px] border border-[#EFEBE1] shadow-sm space-y-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Email Us</p>
                <a className="text-xl font-bold text-gray-900 hover:text-[#3A6447] transition-colors break-all" href="mailto:contact@ayurcare360.com">contact@ayurcare360.com</a>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Call Us</p>
                {/* Fixed the p tag to an a tag here so the tel: link actually works */}
                <a className="text-xl font-bold text-gray-900 hover:text-[#3A6447] transition-colors" href="tel:+919236313005">+91 9236313005</a>
              </div>

              <div className="pt-8 border-t border-[#EFEBE1]">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Follow us</p>
                <div className="flex gap-6">
                  <a className="group flex items-center gap-2 text-gray-500 hover:text-[#3A6447] transition-colors" href="https://www.instagram.com/ayurcare.360?igsh=Nm45MTBrbnk3ZG9z" target="_blank" rel="noopener noreferrer">
                    <Instagram size={20} />
                    <span className="font-bold text-sm">Instagram</span>
                  </a>
                  <a className="group flex items-center gap-2 text-gray-500 hover:text-[#3A6447] transition-colors" href="https://www.facebook.com/share/18TNZK4jCS/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer">
                    <Facebook size={20} />
                    <span className="font-bold text-sm">Facebook</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-[32px] border border-[#EFEBE1] shadow-sm">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1" htmlFor="name">Name</label>
                    <input className="w-full bg-white border border-[#EFEBE1] focus:border-[#3A6447] focus:ring-1 focus:ring-[#3A6447]/30 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all" id="name" name="name" placeholder="Your full name" required type="text" />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1" htmlFor="email">Email</label>
                    <input className="w-full bg-white border border-[#EFEBE1] focus:border-[#3A6447] focus:ring-1 focus:ring-[#3A6447]/30 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-all" id="email" name="email" placeholder="hello@example.com" required type="email" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1" htmlFor="message">Message</label>
                  <textarea className="w-full bg-white border border-[#EFEBE1] focus:border-[#3A6447] focus:ring-1 focus:ring-[#3A6447]/30 rounded-xl px-4 py-3.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 resize-none outline-none transition-all" id="message" name="message" placeholder="How can we help you today?" required rows="6"></textarea>
                </div>

                <div className="pt-4">
                  <button className="w-full md:w-auto bg-[#3A6447] hover:bg-[#2C4D36] text-white px-10 py-4 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-sm" type="submit">
                    Send Message
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-transparent py-12 px-8 border-t border-[#EFEBE1] mt-auto">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-8 w-full md:px-10">
          <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400">
            © {new Date().getFullYear()} AyurCare360
          </p>
          <div className="flex gap-8">
            <Link className="text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#3A6447] transition-colors" to="/privacy">Privacy Policy</Link>
            <Link className="text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#3A6447] transition-colors" to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactPage;