import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ShieldCheck, Save, ChevronRight, Loader2, Camera } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import PersonalInfoSection from '../../components/admin/doctors/add-doctor/PersonalInfoSection';
import ConsultationSection from '../../components/admin/doctors/add-doctor/ConsultationSection';
import ProfessionalSection from '../../components/admin/doctors/add-doctor/ProfessionalSection';
import AboutSection from '../../components/admin/doctors/add-doctor/AboutSection';

const AdminEditDoctorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', emergencyContact: '', address: '', password: '',
    fees: '', startTime: '09:00', endTime: '17:00',
    specialization: '', registrationNumber: '', qualifications: '', experience: '',
    about: '', avatar: null, status: 'Verified'
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await adminApi.getDoctorDetails(id);
        if (res.success && res.data) {
          const doc = res.data;
          setFormData({
            fullName: doc.full_name || '',
            email: doc.email || '',
            phone: doc.phone || '',
            specialization: doc.specialization || '',
            experience: doc.experience_years ? doc.experience_years.toString() : '',
            fees: doc.consultation_fee ? doc.consultation_fee.toString() : '',
            about: doc.bio || '',
            address: doc.clinic_address || '',
            avatar: doc.avatar || null, // Loads existing image
            status: doc.verification_status || 'Verified',
            qualifications: doc.qualifications || '',
            registrationNumber: doc.registration_number || '',
            emergencyContact: '',
            password: '',
            startTime: '09:00',
            endTime: '17:00',
          });
        }
      } catch (err) {
        console.error("Failed to fetch doctor details", err);
        setError("Failed to load doctor data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        avatarFile: file,
        avatarPreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleUpdateDoctor = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const payload = new FormData();
      if (formData.fullName) payload.append('full_name', formData.fullName);
      if (formData.password) payload.append('password', formData.password);
      payload.append('specialization', formData.specialization);
      payload.append('experience_years', parseInt(formData.experience) || 0);
      payload.append('consultation_fee', parseFloat(formData.fees) || 0);
      payload.append('verification_status', formData.status);
      payload.append('about', formData.about);
      payload.append('clinic_address', formData.address);

      if (formData.avatarFile) {
        payload.append('avatar', formData.avatarFile);
      }

      const res = await adminApi.updateDoctorDetails(id, payload);
      if (res.success) navigate('/admin/doctors');
      else setError(res.message || 'Failed to update doctor.');
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto flex flex-col h-full animate-in fade-in duration-300">

      {/* Header & Breadcrumbs */}
      <div className="mb-10">
        <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Link to="/admin/doctors" className="hover:text-[#4A7C59] transition-colors">Doctors</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900">Edit Profile</span>
        </div>
        <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Edit Doctor
        </h1>
        {error && <p className="text-sm font-bold text-red-600 mt-2 bg-red-50 p-3 rounded-xl inline-block">{error}</p>}
      </div>

      {/* Profile Image Uploader - UPDATED UI */}
      <div className="mb-8 flex items-center gap-6">
        <div className="relative w-24 h-24 rounded-full border border-[#EFEBE1] shadow-sm bg-white flex items-center justify-center overflow-hidden group hover:border-[#4A7C59] transition-colors cursor-pointer">

          {/* Always shows image OR initials */}
          <img
            src={formData.avatarPreview || formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Doc')}&background=FDF9EE&color=3A6447&size=128`}
            alt="Doctor Avatar"
            className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300"
          />

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <Camera size={20} className="text-gray-900 mb-1" />
            <span className="text-gray-900 text-[10px] font-extrabold uppercase tracking-wider">Change</span>
          </div>

          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">Doctor Profile Photo</h3>
          <p className="text-xs font-medium text-gray-500 mt-1">Click the image to upload a new photo.</p>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-12 gap-y-10 flex-1 mb-8">
        <div className="lg:col-span-2 flex flex-col gap-12">
          <PersonalInfoSection formData={formData} onChange={handleInputChange} />
          <ProfessionalSection formData={formData} onChange={handleInputChange} />
        </div>
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
          <p className="text-xs font-bold">Changes are tracked and securely encrypted.</p>
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
            onClick={handleUpdateDoctor}
            className="flex-1 md:flex-none px-8 py-3.5 bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 disabled:cursor-not-allowed text-white text-sm font-bold rounded-full flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">Saving...</span>
            ) : (
              <><Save size={18} /> Save Changes</>
            )}
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminEditDoctorPage;