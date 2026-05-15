import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Leaf, Search, ArrowLeft } from 'lucide-react';
import { websiteBlogs } from '../../data/websiteBlogs';

const BlogDetailsPage = () => {
  const { id } = useParams();

  // Find the exact blog from our data file
  const blog = websiteBlogs.find(b => b.id === id);

  // If someone types a wrong URL, redirect them back to the blogs page
  if (!blog) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] font-sans flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between py-6 px-8 md:px-16 max-w-7xl mx-auto w-full gap-6">
        <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-[#3A6447] tracking-tight shrink-0">
          <Leaf size={28} /> AyurCare360
        </Link>
        <div className="hidden md:block relative w-full max-w-2xl mx-4">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search wellness topics..." className="w-full bg-white border border-[#EFEBE1] rounded-full py-3.5 pl-12 pr-6 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/30 shadow-sm transition-all" />
        </div>
        <Link to="/login" className="bg-[#3A6447] hover:bg-[#2C4D36] text-white text-sm font-bold py-3.5 px-8 rounded-full transition-colors shadow-sm shrink-0">
          Login / SignUp
        </Link>
      </nav>

      {/* Article Content */}
      <main className="flex-1 max-w-4xl mx-auto px-8 py-12 lg:py-16 w-full">
        <Link to="/blogs" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#3A6447] transition-colors mb-10">
          <ArrowLeft size={16} /> Back to all blogs
        </Link>

        {/* Hero Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#E7F3EB] text-[#3A6447] text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
              {blog.category}
            </span>
            <span className="text-[11px] font-bold text-gray-400">{blog.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-8">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-500">
            <div className="w-10 h-10 rounded-full bg-[#EFEBE1] flex items-center justify-center text-[#79563E] font-bold">
              {blog.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-bold text-gray-900">{blog.author}</p>
              <p className="text-[11px] uppercase tracking-widest mt-0.5">{blog.date}</p>
            </div>
          </div>
        </div>

        {/* Hero Image */}
        <div className="w-full h-[400px] md:h-[500px] rounded-[32px] overflow-hidden shadow-sm border border-[#EFEBE1] mb-16">
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </div>

        {/* Body Content Renderer */}
        <article className="prose prose-lg max-w-none text-gray-600 mb-20">
          {blog.content.map((block, index) => {
            switch (block.type) {
              case 'paragraph':
                return <p key={index} className="mb-6 leading-relaxed text-[17px] font-medium">{block.text}</p>;
              case 'heading':
                return <h2 key={index} className="text-3xl font-extrabold text-gray-900 mt-12 mb-6 tracking-tight">{block.text}</h2>;
              case 'subheading':
                return <h3 key={index} className="text-xl font-bold text-gray-900 mt-8 mb-4">{block.text}</h3>;
              case 'list':
                return (
                  <ul key={index} className="space-y-3 mb-8 ml-4">
                    {block.items.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-[17px] font-medium">
                        <span className="text-[#3A6447] mt-1">•</span> {item}
                      </li>
                    ))}
                  </ul>
                );
              case 'quote':
                return (
                  <blockquote key={index} className="border-l-4 border-[#D9774B] pl-6 py-2 my-10 bg-[#FDF1E8]/50 rounded-r-2xl italic text-xl font-medium text-gray-900 leading-relaxed">
                    "{block.text}"
                  </blockquote>
                );
              default:
                return null;
            }
          })}
        </article>
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

export default BlogDetailsPage;