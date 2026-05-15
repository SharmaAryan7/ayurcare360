import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { TextArea, SaveButton, CardHeader } from './SettingsUI';
import { doctorApi } from '../../../api/doctorApi';

const PhilosophyOfCareForm = ({ data }) => {
    const initialPhilosophy = data?.philosophy_of_care || '';
    const [philosophy, setPhilosophy] = useState(initialPhilosophy);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const hasChanges = philosophy !== initialPhilosophy;

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await doctorApi.updatePhilosophyOfCare({ philosophy_of_care: philosophy });
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update philosophy", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setPhilosophy(initialPhilosophy);
        setIsEditing(false);
    };

    return (
        <div className="bg-white rounded-3xl px-8 py-6 shadow-sm border border-gray-100 flex flex-col h-full">
            <CardHeader
                icon={Heart}
                title="Philosophy of Care"
                description="Share your unique approach to Ayurvedic healing."
                iconColor="text-teal-600"
                iconBg="bg-teal-50"
            />

            <div className="flex-1 mt-4">
                <TextArea
                    value={philosophy}
                    onChange={(e) => setPhilosophy(e.target.value)}
                    placeholder="I believe in treating the root cause..."
                    disabled={!isEditing}
                />
            </div>

            <div className="flex justify-end mt-6 gap-4">
                {!isEditing ? (
                    <SaveButton text="Edit" colorClass="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)} />
                ) : (
                    <>
                        {hasChanges && (
                            <SaveButton
                                text={isSaving ? "Updating..." : "Update Philosophy"}
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

export default PhilosophyOfCareForm;