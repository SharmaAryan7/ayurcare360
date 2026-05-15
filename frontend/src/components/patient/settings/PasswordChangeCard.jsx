import React, { useState } from 'react';
import { ShieldCheck, X, Check, Edit2 } from 'lucide-react';
import { patientApi } from '../../../api/patientApi'; // Adjust path if needed

const INITIAL_PASSWORDS = { currentPassword: '', newPassword: '', confirmPassword: '' };

const PasswordChangeCard = () => {
  const [passwords, setPasswords] = useState(INITIAL_PASSWORDS);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setPasswords({ ...passwords, [e.target.name]: e.target.value });

  const handleEditClick = () => {
    setIsEditing(true);
    setPasswords(INITIAL_PASSWORDS);
  };

  const handleCancel = () => {
    setPasswords(INITIAL_PASSWORDS);
    setIsEditing(false);
  };

  const handleUpdate = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await patientApi.changePassword({
        current_password: passwords.currentPassword,
        new_password: passwords.newPassword
      });
      alert("Password updated successfully!");
      setIsEditing(false);
      setPasswords(INITIAL_PASSWORDS);
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password. Check your current password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAF7F2] rounded-[32px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm h-full flex flex-col transition-all">
      <div className="flex items-center gap-3 mb-8">
        <ShieldCheck size={20} className="text-gray-500" />
        <h3 className="text-xl font-bold text-gray-900">Password Change</h3>
      </div>

      <div className="flex flex-col gap-5 mb-8 flex-1">
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={isEditing ? passwords.currentPassword : '••••••••'}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none transition-colors ${isEditing ? 'bg-white border border-[#EFEBE1] focus:border-[#4A7C59] cursor-text' : 'bg-transparent border border-transparent cursor-not-allowed'}`}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">New Password</label>
          <input
            type="password"
            name="newPassword"
            value={isEditing ? passwords.newPassword : '••••••••'}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none transition-colors ${isEditing ? 'bg-white border border-[#EFEBE1] focus:border-[#4A7C59] cursor-text' : 'bg-transparent border border-transparent cursor-not-allowed'}`}
          />
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={isEditing ? passwords.confirmPassword : '••••••••'}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-xl p-3 text-sm text-gray-900 font-medium focus:outline-none transition-colors ${isEditing ? 'bg-white border border-[#EFEBE1] focus:border-[#4A7C59] cursor-text' : 'bg-transparent border border-transparent cursor-not-allowed'}`}
          />
        </div>
      </div>

      <div className="w-full mt-auto">
        {isEditing ? (
          <div className="flex items-center gap-3">
            <button onClick={handleCancel} className="flex-1 bg-white border border-[#EFEBE1] hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-4 rounded-full transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
              <X size={16} /> Cancel
            </button>
            <button onClick={handleUpdate} disabled={loading} className="flex-1 bg-[#8C6239] hover:bg-[#734F2D] text-white font-bold py-3.5 px-4 rounded-full transition-colors text-sm shadow-sm flex items-center justify-center gap-2">
              <Check size={16} /> {loading ? 'Updating...' : 'Update'}
            </button>
          </div>
        ) : (
          <button onClick={handleEditClick} className="w-full bg-white border border-[#EFEBE1] hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-8 rounded-full transition-colors text-sm flex items-center justify-center gap-2">
            <Edit2 size={16} /> Change Password
          </button>
        )}
      </div>
    </div>
  );
};

export default PasswordChangeCard;