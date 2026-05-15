import React from 'react';

const AboutSection = ({ formData, onChange, isEditing = true }) => {
  return (
    <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm flex flex-col h-full min-h-[300px]">
      <h2 className="text-xl font-extrabold text-gray-900 mb-6">About / Bio</h2>
      <div className="flex-1 flex flex-col">
        <textarea
          name="about"
          value={formData.about}
          onChange={onChange}
          disabled={!isEditing}
          className="flex-1 w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl py-4 px-5 text-sm font-medium text-gray-700 focus:outline-none disabled:opacity-70 resize-y leading-relaxed min-h-[150px]"
          placeholder="Enter a brief professional biography..."
        ></textarea>
      </div>
    </div>
  );
};
export default AboutSection;