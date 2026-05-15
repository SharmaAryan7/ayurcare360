import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, UserPlus, ChevronRight } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import PersonalInfoSection from '../../components/admin/doctors/add-doctor/PersonalInfoSection';
import ConsultationSection from '../../components/admin/doctors/add-doctor/ConsultationSection';
import ProfessionalSection from '../../components/admin/doctors/add-doctor/ProfessionalSection';
import AboutSection from '../../components/admin/doctors/add-doctor/AboutSection';

const AdminAddDoctorPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Centralized Form State (Added avatar: null)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', emergencyContact: '', address: '', password: '',
    fees: '', startTime: '09:00', endTime: '17:00',
    specialization: 'Ayurvedic General Medicine', registrationNumber: '', qualifications: '', experience: '',
    about: '', avatar: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Convert uploaded image to Base64 String
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file, // Store the physical file for AWS
        avatarPreview: URL.createObjectURL(file) // Store a temporary URL for UI preview
      }));
    }
  };

  const handleAddDoctor = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      payload.append('full_name', formData.fullName);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('password', formData.password);
      payload.append('specialization', formData.specialization);
      payload.append('experience_years', parseInt(formData.experience) || 0);
      payload.append('qualifications', formData.qualifications);
      payload.append('registration_number', formData.registrationNumber);
      payload.append('consultation_fee', parseFloat(formData.fees) || 0);
      payload.append('about', formData.about);
      payload.append('clinic_address', formData.address);

      // Append the actual physical file!
      if (formData.avatarFile) {
        payload.append('avatar', formData.avatarFile);
      }

      const res = await adminApi.addDoctor(payload);
      if (res.success || res.doctorId) navigate('/admin/doctors');
      else setError(res.message || 'Failed to add doctor.');
    } catch (error) {
      if (error.response?.status === 409) {
        alert(`⚠️ ERROR: ${error.response.data.message}`);
      } else {
        alert("Database Error: Failed to add doctor.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto flex flex-col h-full animate-in fade-in duration-300">

      {/* Header & Breadcrumbs */}
      <div className="mb-10">
        <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Link to="/admin/doctors" className="hover:text-[#4A7C59] transition-colors">Doctors</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900">Onboarding</span>
        </div>
        <h1 className="text-3xl md:text-[32px] font-extrabold text-green-700 tracking-tight leading-none mb-2">
          Add Doctor
        </h1>
        {error && <p className="text-sm font-bold text-red-600 mt-2 bg-red-50 p-3 rounded-xl inline-block">{error}</p>}
      </div>

      {/* Profile Image Uploader */}
      <div className="mb-8 flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-[#B8C1B6] bg-white flex items-center justify-center overflow-hidden group hover:border-[#4A7C59] transition-colors">
          {(formData.avatarPreview || formData.avatar) ? (
            <img src={formData.avatarPreview || formData.avatar} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-[#4A7C59] text-xs font-bold text-center px-2">Upload Photo</span>
          )}
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Doctor Profile Photo</h3>
          <p className="text-xs font-medium text-gray-500 mt-1">Recommended: Square image, max 5MB.</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10 flex-1 mb-8">

        {/* Left Column (Wider) */}
        <div className="lg:col-span-2 flex flex-col gap-12">
          <PersonalInfoSection formData={formData} onChange={handleInputChange} />
          <ProfessionalSection formData={formData} onChange={handleInputChange} />
        </div>

        {/* Right Column (Narrower) */}
        <div className="lg:col-span-1 flex flex-col gap-12">
          <ConsultationSection formData={formData} onChange={handleInputChange} />
          <AboutSection formData={formData} onChange={handleInputChange} />
        </div>

      </div>

      {/* Bottom Action Footer */}
      <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-[#EFEBE1] gap-6">

        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-8 h-8 rounded-full bg-[#E7F3EB] flex items-center justify-center text-[#3A6447]">
            <ShieldCheck size={16} />
          </div>
          <p className="text-xs font-bold">All data is encrypted and HIPAA compliant.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            disabled={isSubmitting}
            onClick={() => navigate('/admin/doctors')}
            className="flex-1 md:flex-none px-8 py-3.5 bg-white border border-[#EFEBE1] hover:bg-gray-50 disabled:opacity-50 text-gray-700 text-sm font-bold rounded-full transition-colors shadow-sm"
          >
            Cancel
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleAddDoctor}
            className="flex-1 md:flex-none px-8 py-3.5 bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">Adding...</span>
            ) : (
              <><UserPlus size={18} /> Add Doctor</>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdminAddDoctorPage;