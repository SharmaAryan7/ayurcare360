import React, { useState } from 'react';
import { Tag, Key, CheckCircle } from 'lucide-react';

const PublishingSidebar = ({ formData, onChange, setFormData }) => {
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && newTag.trim() !== '') {
      e.preventDefault();
      if (!formData.tags.includes(newTag.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag.trim()] }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
  };

  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm space-y-8">
      {/* Status */}
      <div>
        <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle size={16} className="text-[#3A6447]" /> Publication Status
        </h3>
        <select
          name="status"
          value={formData.status}
          onChange={onChange}
          className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3 px-4 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 cursor-pointer"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
        </select>
      </div>

      {/* Tags */}
      <div className="pt-6 border-t border-[#EFEBE1]">
        <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Tag size={16} className="text-[#3A6447]" /> Tags
        </h3>
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Add tag & press enter"
          className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {formData.tags?.map((tag, idx) => (
            <span key={idx} className="bg-[#E7F3EB] text-[#3A6447] text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors">&times;</button>
            </span>
          ))}
        </div>
      </div>

      {/* Focus Keyword */}
      <div className="pt-6 border-t border-[#EFEBE1]">
        <h3 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
          <Key size={16} className="text-[#3A6447]" /> Focus Keyword (SEO)
        </h3>
        <input
          type="text"
          name="focusKeyword"
          value={formData.focusKeyword}
          onChange={onChange}
          placeholder="Main SEO keyword"
          className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-3 px-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20"
        />
      </div>
    </div>
  );
};
export default PublishingSidebar;