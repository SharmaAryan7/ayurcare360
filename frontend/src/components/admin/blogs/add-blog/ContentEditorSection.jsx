import React from 'react';

const ContentEditorSection = ({ formData, onChange }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col h-full min-h-[400px]">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">Article Content</h2>
      <div className="flex-1 flex flex-col">
        <textarea
          name="content"
          value={formData.content}
          onChange={onChange}
          className="flex-1 w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-4 px-5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#3A6447]/20 transition-all min-h-[300px] resize-y leading-relaxed"
          placeholder="Write your article content here..."
        ></textarea>
      </div>
    </div>
  );
};
export default ContentEditorSection;