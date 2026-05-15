import React, { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Toggle, SaveButton, CardHeader } from './SettingsUI';
import { doctorApi } from '../../../api/doctorApi';

const PreferencesForm = ({ data }) => {
    const initialPrefs = {
        push_notifications: data?.push_notifications ?? true,
        hd_video: data?.hd_video ?? true,
        public_profile: data?.public_profile ?? true,
    };

    const [prefs, setPrefs] = useState(initialPrefs);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggle = (key) => {
        if (!isEditing) return;
        setPrefs({ ...prefs, [key]: !prefs[key] });
    };

    const hasChanges = JSON.stringify(prefs) !== JSON.stringify(initialPrefs);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await doctorApi.updatePreferences(prefs);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update preferences", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setPrefs(initialPrefs);
        setIsEditing(false);
    };

    return (
        <div className="bg-[#faf2dc] rounded-3xl p-8 shadow-sm border border-gray-100 h-full">
            <CardHeader
                icon={SlidersHorizontal}
                title="Preferences"
                iconColor="text-purple-600"
                iconBg="bg-purple-50"
            />

            <div className="flex flex-col">
                <Toggle
                    label="Push Notifications"
                    description="Receive instant alerts for upcoming appointments and system updates."
                    enabled={prefs.push_notifications}
                    onChange={() => handleToggle('push_notifications')}
                    disabled={!isEditing}
                />
                <Toggle
                    label="HD Video Quality"
                    description="Enable high-definition streaming for all tele-consultations."
                    enabled={prefs.hd_video}
                    onChange={() => handleToggle('hd_video')}
                    disabled={!isEditing}
                />
                <Toggle
                    label="Public Profile"
                    description="Make your profile visible in search results and the global directory."
                    enabled={prefs.public_profile}
                    onChange={() => handleToggle('public_profile')}
                    disabled={!isEditing}
                />
            </div>

            <div className="flex justify-start mt-6 gap-4">
                {!isEditing ? (
                    <SaveButton text="Edit" colorClass="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)} />
                ) : (
                    <>
                        {hasChanges && (
                            <SaveButton
                                text={isSaving ? "Updating..." : "Update Preferences"}
                                colorClass="bg-[#4A7C59] hover:bg-[#3a6146]"
                                onClick={handleSave}
                            />
                        )}
                        <SaveButton text="Cancel" colorClass="bg-red-500 hover:bg-red-600" onClick={handleCancel} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PreferencesForm;