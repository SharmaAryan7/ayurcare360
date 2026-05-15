import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronRight, UserPlus, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import AdminInfoSection from '../../components/admin/settings/admin-form/AdminInfoSection';
import SecuritySection from '../../components/admin/settings/admin-form/SecuritySection';
import AdminPolicyCards from '../../components/admin/settings/admin-form/AdminPolicyCards';

const AdminAddAdminPage = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: 'System Administrator',
    password: '',
    confirmPassword: '',
    phone: '' // Added for backend alignment
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAdmin = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone || '',
        password: formData.password,
        role: formData.role
      };

      const res = await adminApi.addAdmin(payload);
      if (res.success) {
        navigate('/admin/settings');
      } else {
        setError(res.message || 'Failed to add admin.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 md:p-10 max-w-[1000px] mx-auto animate-in fade-in duration-300 flex flex-col h-full">
      <div className="mb-10">
        <div className="flex items-center text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">
          <Link to="/admin/settings" className="hover:text-[#3A6447] transition-colors">Settings</Link>
          <ChevronRight size={12} className="mx-2" />
          <Link to="/admin/settings" className="hover:text-[#3A6447] transition-colors">Staff Management</Link>
          <ChevronRight size={12} className="mx-2" />
          <span className="text-gray-900">Add Admin</span>
        </div>

        <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Add Admin
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Create a new administrative profile with specific access levels.
        </p>
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
            onClick={handleAddAdmin}
            className="bg-[#3A6447] hover:bg-[#2C4D36] disabled:bg-[#3A6447]/70 text-white font-bold py-3.5 px-8 rounded-full flex items-center justify-center gap-2 shadow-sm transition-colors text-sm cursor-pointer"
          >
            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <UserPlus size={18} />}
            {isSubmitting ? 'Adding...' : 'Add Admin'}
          </button>
        </div>
      </div>

      <AdminPolicyCards />
    </div>
  );
};

export default AdminAddAdminPage;