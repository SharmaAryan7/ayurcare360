import React, { useState, useEffect } from 'react';
import { Save, Edit2, Loader2 } from 'lucide-react';
import AccountInfoCard from '../../components/patient/settings/AccountInfoCard';
import PasswordChangeCard from '../../components/patient/settings/PasswordChangeCard';
import NotificationPrefsCard from '../../components/patient/settings/NotificationPrefsCard';
import PrivacySettingsCard from '../../components/patient/settings/PrivacySettingsCard';
import { patientApi } from '../../api/patientApi'; // Ensure this path is correct

const PatientSettingsPage = () => {
  // Initialize with empty objects to prevent undefined errors before data loads
  const [settingsData, setSettingsData] = useState({
    account: {},
    notifications: {},
    privacy: {}
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      const [accRes, notifRes, privRes] = await Promise.all([
        patientApi.getSettingsAccount(),
        patientApi.getSettingsNotifications(),
        patientApi.getSettingsPrivacy()
      ]);

      setSettingsData({
        account: accRes.data || accRes || {},
        notifications: notifRes.data || notifRes || {},
        privacy: privRes.data || privRes || {}
      });
    } catch (error) {
      console.error("Failed to load settings data:", error);
    } finally {
      setLoading(false);
    }
  };

  // General handler to update nested state
  const handleInputChange = (section, field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Save settings to backend
      try {
        setSaving(true);
        await Promise.all([
          patientApi.updateSettingsAccount(settingsData.account),
          patientApi.updateSettingsData({
            notifications: settingsData.notifications,
            privacy: settingsData.privacy
          })
        ]);
        // Re-fetch to ensure local state perfectly matches the database
        await fetchSettingsData();
      } catch (error) {
        console.error("Failed to save settings:", error);
        alert("There was an error saving your changes. Please try again.");
      } finally {
        setSaving(false);
      }
    }
    setIsEditing(!isEditing);
  };

  if (loading) {
    return (
      <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#4A7C59] mb-4" size={32} />
        <p className="text-[#4A7C59] font-bold text-lg">Loading Settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto flex flex-col relative pb-24">

      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl md:text-[40px] font-extrabold text-gray-900 mb-3 tracking-tight">
            Settings
          </h1>
          <p className="text-gray-500 font-medium text-base max-w-2xl leading-relaxed">
            Manage your digital wellness experience. Your privacy and data integrity are our clinical priority.
          </p>
        </div>

        {/* Global Action Button */}
        <button
          onClick={toggleEditMode}
          disabled={saving}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-bold shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed ${isEditing
            ? 'bg-[#2C5F44] text-white hover:bg-[#1E4620]'
            : 'bg-white border border-[#EFEBE1] text-gray-700 hover:bg-[#FAF7F2]'
            }`}
        >
          {saving ? (
            <><Loader2 className="animate-spin" size={18} /> Saving...</>
          ) : isEditing ? (
            <><Save size={18} /> Save Changes</>
          ) : (
            <><Edit2 size={18} /> Edit Settings</>
          )}
        </button>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* Top Row: Account & Password */}
        <div className="lg:col-span-3">
          <AccountInfoCard
            data={settingsData.account}
            isEditing={isEditing}
            onChange={(field, value) => handleInputChange('account', field, value)}
          />
        </div>
        <div className="lg:col-span-2">
          {/* Password generally doesn't toggle inline, it's a dedicated action */}
          <PasswordChangeCard />
        </div>

        {/* Bottom Row: Notifications & Privacy */}
        <div className="lg:col-span-3">
          <NotificationPrefsCard
            data={settingsData.notifications}
            isEditing={isEditing}
            onChange={(field, value) => handleInputChange('notifications', field, value)}
          />
        </div>
        <div className="lg:col-span-2">
          <PrivacySettingsCard
            data={settingsData.privacy}
            isEditing={isEditing}
            onChange={(field, value) => handleInputChange('privacy', field, value)}
          />
        </div>

      </div>

    </div>
  );
};

export default PatientSettingsPage;