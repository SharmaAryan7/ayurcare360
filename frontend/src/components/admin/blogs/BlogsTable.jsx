import React, { useState } from 'react';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; // <-- Added useNavigate
import { adminApi } from '../../../api/adminApi'; // <-- Make sure this path is correct for your folder structure!

const BlogsTable = ({ blogs = [] }) => {
  const navigate = useNavigate(); // <-- Initialize navigate
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = blogs.filter(b =>
    (b.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.author || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // THE FIX: Added Delete Functionality
  const handleDelete = async (blogId) => {
      if (window.confirm("Are you sure you want to delete this article?")) {
          try {
              await adminApi.deleteBlog(blogId);
              window.location.reload(); // Hard reload to clear the table
          } catch (error) {
              console.error("Failed to delete blog:", error);
              alert("Failed to delete. Check your backend console.");
          }
      }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text" placeholder="Search articles..."
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3A6447]/20 transition-all outline-none"
          />
        </div>
        <Link to="/admin/blogs/add" className="bg-[#3A6447] text-white px-5 py-2.5 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#2C4D36] transition-colors">
          <Plus size={16} /> Compose New
        </Link>
      </div>

      <div className="overflow-x-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-widest text-gray-500">
              <th className="px-6 py-4 font-extrabold">Article Title</th>
              <th className="px-6 py-4 font-extrabold">Author</th>
              <th className="px-6 py-4 font-extrabold">Category</th>
              <th className="px-6 py-4 font-extrabold">Views</th>
              <th className="px-6 py-4 font-extrabold">Status</th>
              <th className="px-6 py-4 font-extrabold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredBlogs.length === 0 ? (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No articles found.</td></tr>
            ) : (
              filteredBlogs.map((blog) => (
                <tr key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900 text-sm max-w-xs truncate">{blog.title}</td>
                  <td className="px-6 py-4 font-medium text-gray-500 text-sm">{blog.author || 'Admin'}</td>
                  <td className="px-6 py-4 font-bold text-[#3A6447] text-sm">{blog.category}</td>
                  <td className="px-6 py-4 font-black text-gray-700 text-sm">{Number(blog.views).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${blog.status === 'Published' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                      {blog.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* THE FIX: Added onClick to navigate to Edit, and onClick to trigger Delete */}
                    <button 
                        onClick={() => navigate(`/admin/blogs/edit/${blog.id}`)}
                        className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors mr-2"
                    >
                        <Edit size={16} />
                    </button>
                    <button 
                        onClick={() => handleDelete(blog.id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogsTable;