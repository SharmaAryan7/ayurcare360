import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import BlogInfoSection from '../../components/admin/blogs/add-blog/BlogInfoSection';
import ContentEditorSection from '../../components/admin/blogs/add-blog/ContentEditorSection';
import PublishingSidebar from '../../components/admin/blogs/add-blog/PublishingSidebar';

const AdminEditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    title: '', category: '', audience: 'General Public', shortDescription: '',
    content: '', status: 'Draft', tags: [], focusKeyword: ''
  });

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const res = await adminApi.getBlogDetails(id); // Ensure this exists in adminApi.js
        if (res && res.data) {
          setFormData({
            title: res.data.title || '',
            category: res.data.category || '',
            audience: res.data.audience || 'General Public',
            shortDescription: res.data.shortDescription || '',
            content: res.data.content || '',
            status: res.data.status || 'Draft',
            tags: res.data.tags || [],
            focusKeyword: res.data.focusKeyword || ''
          });
        }
      } catch (err) {
        console.error("Failed to load blog data", err);
        setError("Failed to load blog data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlogData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitChanges = async (targetStatus) => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        content: formData.content,
        category: formData.category,
        status: targetStatus
      };

      await adminApi.updateBlog(id, payload);
      navigate('/admin/blogs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = () => submitChanges('Draft');
  const handleSaveChanges = () => submitChanges(formData.status); // Keep existing status

  if (isLoading) {
    return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" /></div>;
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300 flex flex-col min-h-screen">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
            <Link to="/admin/blogs" className="hover:text-[#3A6447] transition-colors">Blogs</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-gray-900">Edit Blog</span>
          </div>
          <div className="flex items-end gap-4">
            <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">Edit Blog</h1>
            <span className="bg-[#EAE5D9] text-[#79563E] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest mb-2 shadow-sm">
              ID: #{id}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-500">Update your editorial piece for the healthcare community.</p>
          {error && <p className="text-sm font-bold text-red-600 mt-3 bg-red-50 p-3 rounded-xl inline-block">{error}</p>}
        </div>

        <div className="flex items-center gap-4">
          <button
            disabled={isSubmitting}
            onClick={handleSaveDraft}
            className="bg-white border border-[#EFEBE1] hover:bg-gray-50 disabled:opacity-50 text-gray-700 font-bold py-3.5 px-6 rounded-full transition-colors shadow-sm text-sm cursor-pointer"
          >
            {isSubmitting && formData.status === 'Draft' ? 'Saving...' : 'Save as Draft'}
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSaveChanges}
            className="bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 text-white font-bold py-3.5 px-6 rounded-full transition-colors shadow-sm text-sm cursor-pointer"
          >
            {isSubmitting && formData.status !== 'Draft' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
        <div className="lg:col-span-2 flex flex-col gap-10">
          <BlogInfoSection formData={formData} onChange={handleInputChange} setFormData={setFormData} />
          <ContentEditorSection formData={formData} onChange={handleInputChange} />
        </div>
        <div className="lg:col-span-1">
          <PublishingSidebar formData={formData} onChange={handleInputChange} setFormData={setFormData} />
        </div>
      </div>
    </div>
  );
};

export default AdminEditBlogPage;