import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Save, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import AdminInfoSection from '../../components/admin/settings/admin-form/AdminInfoSection';
import SecuritySection from '../../components/admin/settings/admin-form/SecuritySection';
import AdminPolicyCards from '../../components/admin/settings/admin-form/AdminPolicyCards';

const AdminEditAdminPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '', email: '', role: 'System Administrator', phone: '', password: '', confirmPassword: ''
  });

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const res = await adminApi.getAdminDetails(id); // Ensure this exists in adminApi.js
        if (res && res.data) {
          setFormData({
            fullName: res.data.full_name || '',
            email: res.data.email || '',
            role: res.data.role === 'admin' ? 'System Administrator' : 'Staff',
            phone: res.data.phone || '',
            password: '', confirmPassword: ''
          });
        }
      } catch (error) {
        console.error("Failed to load admin data", error);
        setError("Failed to load profile data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminDetails();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (formData.password && formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        ...(formData.password && { password: formData.password }) // Only send if changed
      };

      await adminApi.updateAdminDetails(id, payload);
      navigate('/admin/settings');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update admin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-full min-h-[60vh]"><Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" /></div>;
  }

  return (
    <div className="p-8 md:p-10 max-w-[1000px] mx-auto animate-in fade-in duration-300 flex flex-col h-full">
      <div className="mb-10">
        <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Link to="/admin/settings" className="hover:text-[#3A6447] transition-colors">Settings</Link>
          <ChevronRight size={12} className="mx-2" />
          <Link to="/admin/settings" className="hover:text-[#3A6447] transition-colors">Staff Management</Link>
          <ChevronRight size={12} className="mx-2" />
          <span className="text-gray-900">Edit Admin</span>
        </div>

        <div className="flex items-end gap-4 mb-2">
          <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none">Edit Admin</h1>
          <span className="bg-[#EAE5D9] text-[#79563E] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            ID: #{id}
          </span>
        </div>
        <p className="text-sm font-medium text-gray-500">Update the administrative profile and modify access levels.</p>
        {error && <p className="text-sm font-bold text-red-600 mt-3 bg-red-50 p-3 rounded-xl inline-block">{error}</p>}
      </div>

      <div className="flex-1">
        <AdminInfoSection formData={formData} onChange={handleInputChange} />
        <SecuritySection formData={formData} onChange={handleInputChange} />

        <div className="flex items-center justify-end gap-4 mt-8">
          <button
            disabled={isSubmitting}
            onClick={() => navigate('/admin/settings')}
            className="text-sm font-bold text-gray-500 hover:text-gray-900 disabled:opacity-50 transition-colors px-6 py-3.5 cursor-pointer"
          >
            Discard Changes
          </button>
          <button
            disabled={isSubmitting}
            onClick={handleSaveChanges}
            className="bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 text-white font-bold py-3.5 px-8 rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors text-sm cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
      <AdminPolicyCards />
    </div>
  );
};

export default AdminEditAdminPage;