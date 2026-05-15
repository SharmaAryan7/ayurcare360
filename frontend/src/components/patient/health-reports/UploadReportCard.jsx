import React, { useRef, useState } from 'react';
import { UploadCloud, Info } from 'lucide-react';

const UploadReportCard = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await processUpload(file);
    }
  };

  const processUpload = async (file) => {
    setIsUploading(true);
    try {
      // Create actual FormData for the backend API
      const formData = new FormData();
      formData.append('report', file);
      formData.append('document_name', file.name.split('.')[0] || 'Uploaded Document');
      formData.append('document_type', 'Patient Uploaded File');

      // Let the parent component handle the actual API call
      await onUpload(formData);

      alert(`Successfully uploaded: ${file.name}`);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload the document. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      await processUpload(file);
    }
  };

  return (
    <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Upload New Report</h3>
        <span className="text-[10px] font-extrabold text-[#4A7C59] bg-[#E7F3EB] px-3 py-1 rounded-full uppercase tracking-widest">
          Secure Cloud
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf,.jpg,.jpeg,.png"
        className="hidden"
        disabled={isUploading}
      />

      <div
        onClick={() => !isUploading && fileInputRef.current.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors mb-6 group ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          } ${isDragging ? 'border-[#4A7C59] bg-[#E7F3EB]' : 'border-[#EFEBE1] bg-[#FAF7F2] hover:bg-[#F4F1EB]'}`}
      >
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 shadow-sm transition-transform ${isDragging ? 'bg-[#2C4D36] text-white scale-110' : 'bg-[#3A6447] text-white group-hover:scale-105'}`}>
          <UploadCloud size={24} className={isUploading ? 'animate-bounce' : ''} />
        </div>
        <p className="text-sm font-bold text-gray-900 mb-1">
          {isUploading ? 'Uploading...' : isDragging ? 'Drop file here' : 'Click to upload or drag & drop'}
        </p>
        <p className="text-xs font-medium text-gray-400">PDF, JPG or PNG (MAX. 20MB)</p>
      </div>

      <div className="flex gap-3 bg-[#FDF9EE] p-4 rounded-xl border border-[#EFEBE1]">
        <Info size={18} className="text-[#D9774B] shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-gray-600 leading-relaxed">
          Uploaded reports are automatically categorized by our Ayur AI to extract key metrics for your vitality trends.
        </p>
      </div>
    </div>
  );
};

export default UploadReportCard;