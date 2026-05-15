import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import BlogInfoSection from '../../components/admin/blogs/add-blog/BlogInfoSection';
import ContentEditorSection from '../../components/admin/blogs/add-blog/ContentEditorSection';
import PublishingSidebar from '../../components/admin/blogs/add-blog/PublishingSidebar';

const AdminAddBlogPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Ayurveda Insights',
    audience: 'General Public',
    shortDescription: '',
    content: '',
    status: 'Draft',
    tags: ['Ayurveda', 'Health', 'Lifestyle'],
    focusKeyword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const submitBlog = async (statusOverride) => {
    setIsSubmitting(true);
    setError('');

    const finalStatus = statusOverride || formData.status;

    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('content', formData.content);
      payload.append('category', formData.category);
      payload.append('status', finalStatus);
      payload.append('audience', formData.audience);
      payload.append('shortDescription', formData.shortDescription);

      // Append physical image file
      if (formData.imageFile) {
        payload.append('image', formData.imageFile); // Caught by upload.single('image')
      }

      const res = await adminApi.addNewBlog(payload);

      if (res.success) {
        navigate('/admin/blogs');
      } else {
        setError(res.message || 'Failed to save blog.');
      }
    } catch (err) {
      console.error('Blog submission failed', err);
      setError('An error occurred while saving the blog.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => submitBlog('Draft');
  const handlePublish = () => submitBlog('Published');

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300 flex flex-col min-h-screen">

      {/* Header & Breadcrumbs */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Link to="/admin/blogs" className="hover:text-[#3A6447] transition-colors">Blogs</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900">Add Blog</span>
          </div>
          <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
            Add Blog
          </h1>
          <p className="text-sm font-medium text-gray-500">
            Create a new editorial piece for the healthcare community.
          </p>
          {error && <p className="text-sm font-bold text-red-600 mt-3 bg-red-50 p-3 rounded-xl inline-block">{error}</p>}
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-4">
          <button
            disabled={isSubmitting}
            onClick={handleSaveDraft}
            className="bg-white border border-[#EFEBE1] hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-bold py-3.5 px-6 rounded-full transition-colors shadow-sm text-sm"
          >
            {isSubmitting && formData.status === 'Draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            disabled={isSubmitting}
            onClick={handlePublish}
            className="bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-full transition-colors shadow-sm text-sm"
          >
            {isSubmitting && formData.status === 'Published' ? 'Publishing...' : 'Publish Blog'}
          </button>
        </div>
      </div>

      {/* Main Grid: 2/3 Content Editor | 1/3 Publishing Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">

        {/* Left Column (Content Editor) */}
        <div className="lg:col-span-2 flex flex-col gap-10">
          <BlogInfoSection formData={formData} onChange={handleInputChange} />
          <ContentEditorSection formData={formData} onChange={handleInputChange} />
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-1">
          <PublishingSidebar formData={formData} onChange={handleInputChange} setFormData={setFormData} />
        </div>

      </div>

      {/* Bottom Floating Publish Button */}
      <div className="mt-8 flex justify-between items-center text-sm font-medium text-gray-400 border-t border-[#EFEBE1] pt-6">
        <p>Last saved: Just now</p>
        <button
          disabled={isSubmitting}
          onClick={handlePublish}
          className="bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-full transition-colors shadow-sm text-sm uppercase tracking-widest"
        >
          {isSubmitting ? 'Processing...' : 'Publish Blog'}
        </button>
      </div>

    </div>
  );
};

export default AdminAddBlogPage;