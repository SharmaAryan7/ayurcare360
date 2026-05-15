import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2 } from 'lucide-react';
import imageCompression from 'browser-image-compression';

const BlogInfoSection = ({ formData, onChange, setFormData }) => {
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsCompressing(true);
      try {
        const options = {
          maxSizeMB: 0.2, // Compress to ~200KB for fast loading
          maxWidthOrHeight: 1200,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(file, options);

        // Update the parent's form state securely
        setFormData(prev => ({
          ...prev,
          imageFile: compressedFile,
          imagePreview: URL.createObjectURL(compressedFile)
        }));
      } catch (error) {
        console.error("Compression Error:", error);
        alert("Failed to process image. Try a different file.");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm space-y-6">

      {/* 🚨 NEW: Blog Thumbnail Upload UI */}
      <div className="mb-8">
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Blog Thumbnail</label>
        <div className="flex items-center gap-6">
          <div className="w-48 h-32 rounded-2xl border border-[#EFEBE1] overflow-hidden bg-gray-50 flex-shrink-0 flex items-center justify-center shadow-inner relative">
            {isCompressing ? (
              <Loader2 className="animate-spin text-[#3A6447]" size={24} />
            ) : formData.imagePreview ? (
              <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : formData.image_url ? (
              <img src={formData.image_url} alt="Current Thumbnail" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
            ) : (
              <ImageIcon className="text-gray-400" size={32} />
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              id="blogImage"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isCompressing}
            />
            <label
              htmlFor="blogImage"
              className={`inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EFEBE1] hover:bg-gray-50 text-gray-700 text-sm font-bold rounded-full transition-colors cursor-pointer shadow-sm ${isCompressing ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <UploadCloud size={16} /> {isCompressing ? 'Processing...' : 'Choose Thumbnail'}
            </label>
            <p className="text-xs font-medium text-gray-400 mt-2">Recommended size: 1200x800px. JPG, PNG, WEBP (Auto-compressed).</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          Blog Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onChange}
          required
          placeholder="e.g. Understanding Vata Dosha in Modern Times"
          className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={onChange}
            className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all cursor-pointer"
          >
            <option value="Ayurveda Insights">Ayurveda Insights</option>
            <option value="Diet & Nutrition">Diet & Nutrition</option>
            <option value="Mental Wellness">Mental Wellness</option>
            <option value="Case Studies">Case Studies</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
            Target Audience
          </label>
          <select
            name="audience"
            value={formData.audience}
            onChange={onChange}
            className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all cursor-pointer"
          >
            <option value="General Public">General Public</option>
            <option value="Patients">Patients</option>
            <option value="Ayurvedic Practitioners">Ayurvedic Practitioners</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
          Short Excerpt / Meta Description
        </label>
        <textarea
          name="shortDescription"
          value={formData.shortDescription}
          onChange={onChange}
          rows="2"
          placeholder="A brief 1-2 sentence summary of the article..."
          className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3.5 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all resize-none"
        ></textarea>
        <p className="text-right text-[10px] font-bold text-gray-400 mt-1">
          {formData.shortDescription.length} / 160 characters
        </p>
      </div>

    </div>
  );
};

export default BlogInfoSection;