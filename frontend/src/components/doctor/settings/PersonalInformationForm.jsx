import React, { useState, useRef } from 'react';
import { User, Camera } from 'lucide-react';
import { FormGroup, Input, SaveButton, CardHeader } from './SettingsUI';
import { doctorApi } from '../../../api/doctorApi';

const PersonalInformationForm = ({ data }) => {
    const fileInputRef = useRef(null);
    const initialData = {
        full_name: `${data?.first_name || ''} ${data?.last_name || ''}`.trim(),
        email: data?.email || '',
        phone: data?.phone_number || '',
        bio: data?.bio || '',
        avatar: data?.avatar || null
    };

    const [formData, setFormData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    // AWS S3 Approach: Catch the physical file
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({
                ...prev,
                avatarFile: file,
                avatarPreview: URL.createObjectURL(file)
            }));
            setIsEditing(true); // Auto-enable edit mode so they can save it
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Use FormData for AWS upload
            const payload = new FormData();
            const nameParts = formData.full_name.split(' ');

            payload.append('first_name', nameParts[0] || '');
            payload.append('last_name', nameParts.slice(1).join(' ') || '');
            payload.append('email', formData.email);
            payload.append('phone_number', formData.phone);
            payload.append('bio', formData.bio);

            if (formData.avatarFile) {
                payload.append('avatar', formData.avatarFile); // Caught by upload.single('avatar')
            }

            await doctorApi.updateSettingsPersonalInfo(payload);
            setIsEditing(false);
            window.location.reload(); // Refresh to get the live AWS URL
        } catch (error) {
            console.error("Failed to update personal info", error);
            alert("Failed to update profile.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <CardHeader icon={User} title="Personal Information" iconColor="text-[#4A7C59]" iconBg="bg-[#4A7C59]/10" />

            <div className="flex items-center gap-6 mb-8">
                <div className="relative w-24 h-24 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden group cursor-pointer" onClick={() => isEditing && fileInputRef.current.click()}>
                    <img
                        src={formData.avatarPreview || formData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'Doc')}&background=FDF9EE&color=3A6447`}
                        alt="Profile"
                        className={`w-full h-full object-cover transition-opacity ${isEditing ? 'group-hover:opacity-50' : ''}`}
                    />
                    {isEditing && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Camera size={20} className="text-gray-900" />
                        </div>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Profile Picture</h3>
                    <p className="text-xs text-gray-500 mt-1">{isEditing ? 'Click image to upload new photo' : 'Click Edit to change photo'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormGroup label="Full Name">
                    <Input name="full_name" value={formData.full_name} onChange={handleChange} disabled={!isEditing} />
                </FormGroup>
                <FormGroup label="Phone Number">
                    <Input name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} />
                </FormGroup>
                <div className="md:col-span-2">
                    <FormGroup label="Email Address">
                        <Input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} />
                    </FormGroup>
                </div>
            </div>

            <div className="flex justify-start mt-4 gap-4">
                {!isEditing ? (
                    <SaveButton text="Edit" colorClass="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)} />
                ) : (
                    <>
                        <SaveButton text={isSaving ? "Updating..." : "Update Information"} colorClass="bg-[#4A7C59] hover:bg-[#3a6146]" onClick={handleSave} />
                        <SaveButton text="Cancel" colorClass="bg-red-500 hover:bg-red-600" onClick={handleCancel} />
                    </>
                )}
            </div>
        </div>
    );
};

export default PersonalInformationForm;