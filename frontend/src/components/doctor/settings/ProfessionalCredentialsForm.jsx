import React, { useState } from 'react';
import { Award } from 'lucide-react';
import { FormGroup, Input, SaveButton, CardHeader } from './SettingsUI';
import { doctorApi } from '../../../api/doctorApi';

const ProfessionalCredentialsForm = ({ data }) => {
    const initialData = {
        specialization: data?.specialization || '',
        experience_years: data?.experience_years || '',
        qualifications: data?.qualifications || '',
        medical_license_number: data?.medical_license_number || '',
    };

    const [formData, setFormData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await doctorApi.updateProfessionalCredentials({
                ...formData,
                experience_years: parseInt(formData.experience_years) || 0
            });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update credentials", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData(initialData);
        setIsEditing(false);
    };

    return (
        <div className="bg-[#faf2dc] rounded-3xl p-8 shadow-sm border border-gray-100">
            <CardHeader icon={Award} title="Professional Credentials" iconColor="text-blue-600" iconBg="bg-blue-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormGroup label="Specialization">
                    <Input name="specialization" value={formData.specialization} onChange={handleChange} disabled={!isEditing} />
                </FormGroup>
                <FormGroup label="Experience (Years)">
                    <Input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange} disabled={!isEditing} />
                </FormGroup>
                <FormGroup label="Qualifications">
                    <Input name="qualifications" value={formData.qualifications} onChange={handleChange} disabled={!isEditing} />
                </FormGroup>
                <FormGroup label="Medical License No.">
                    <Input name="medical_license_number" value={formData.medical_license_number} onChange={handleChange} disabled={!isEditing} />
                </FormGroup>
            </div>

            <div className="flex justify-start mt-4 gap-4">
                {!isEditing ? (
                    <SaveButton text="Edit" colorClass="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)} />
                ) : (
                    <>
                        {hasChanges && (
                            <SaveButton
                                text={isSaving ? "Updating..." : "Update Credentials"}
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

export default ProfessionalCredentialsForm;