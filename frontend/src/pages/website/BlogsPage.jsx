import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Search, ArrowRight } from 'lucide-react';
import { websiteBlogs } from '../../data/websiteBlogs';

const BlogsPage = () => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      {/* Navbar */}
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
        <Link to="/login" className="bg-[#3A6447] hover:bg-[#2C4D36] text-white text-sm font-bold py-3.5 px-8 rounded-full transition-colors shadow-sm shrink-0">
          Login / SignUp
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-8 md:px-16 py-16 lg:py-24 w-full">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-6">Blogs & Insights</h1>
          <p className="text-lg font-medium text-gray-600 leading-relaxed">
            Explore Ayurvedic wisdom and wellness tips tailored for modern living.
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {websiteBlogs.map((blog) => (
            <Link to={`/blogs/${blog.id}`} key={blog.id} className="bg-white rounded-[32px] border border-[#EFEBE1] shadow-sm overflow-hidden group cursor-pointer flex flex-col">
              <div className="h-56 overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#E7F3EB] text-[#3A6447] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
                    {blog.category}
                  </span>
                  <span className="text-[11px] font-bold text-gray-400">{blog.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#3A6447] transition-colors line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-sm font-medium text-gray-500 line-clamp-3 mb-8 flex-1">
                  {blog.shortDescription}
                </p>
                <button className="text-sm font-bold text-[#3A6447] flex items-center gap-2 group-hover:gap-3 transition-all mt-auto">
                  Read Article <ArrowRight size={16} />
                </button>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#EFEBE1] bg-white py-12 px-8 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-2xl font-extrabold text-[#3A6447] tracking-tight">
            <Leaf size={28} /> AyurCare360
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
            <Link to="/about" className="hover:text-[#3A6447] transition-colors">About</Link>
            <Link to="/help" className="hover:text-[#3A6447] transition-colors">Help Desk</Link>
            <Link to="/blogs" className="text-[#3A6447] transition-colors">Blogs</Link>
            <Link to="/contact" className="hover:text-[#3A6447] transition-colors">Contact Us</Link>
            <Link to="/privacy" className="hover:text-[#3A6447] transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-[#3A6447] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BlogsPage;