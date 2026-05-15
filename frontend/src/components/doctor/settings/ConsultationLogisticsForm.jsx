import React, { useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { FormGroup, Input, SaveButton, CardHeader } from './SettingsUI';
import { doctorApi } from '../../../api/doctorApi';

const ConsultationLogisticsForm = ({ data }) => {
    // Parse availability_schedule safely
    let schedule = { Mon: true, Tue: true, Wed: true, Thu: true, Fri: true, Sat: false, Sun: false };
    if (data?.availability_schedule) {
        try {
            schedule = typeof data.availability_schedule === 'string'
                ? JSON.parse(data.availability_schedule)
                : data.availability_schedule;
        } catch (e) { console.error("Error parsing schedule"); }
    }

    const initialData = {
        consultation_fee: data?.consultation_fee || '',
        clinic_address: data?.clinic_address || '',
        availability_schedule: schedule
    };

    const [formData, setFormData] = useState(initialData);
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const toggleDay = (day) => {
        if (!isEditing) return;
        setFormData(prev => ({
            ...prev,
            availability_schedule: { ...prev.availability_schedule, [day]: !prev.availability_schedule[day] }
        }));
    };

    const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialData);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await doctorApi.updateConsultationLogistics(formData);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update logistics", error);
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
            <CardHeader icon={CalendarClock} title="Consultation Logistics" iconColor="text-orange-500" iconBg="bg-orange-50" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
                <FormGroup label="Consultation Fee (₹)">
                    <Input
                        type="number"
                        name="consultation_fee"
                        value={formData.consultation_fee}
                        onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                        disabled={!isEditing}
                    />
                </FormGroup>

                <FormGroup label="Availability Days">
                    <div className="flex flex-wrap gap-2 mt-1">
                        {Object.keys(formData.availability_schedule).map(day => (
                            <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                disabled={!isEditing}
                                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center border ${!isEditing ? 'cursor-not-allowed opacity-70' : ''}
                                    ${formData.availability_schedule[day]
                                        ? 'bg-[#4A7C59] text-white border-[#4A7C59]'
                                        : 'bg-gray-50 text-gray-500 border-gray-200'}`}
                            >
                                {day}
                            </button>
                        ))}
                    </div>
                </FormGroup>

                <div className="md:col-span-2 mt-4">
                    <FormGroup label="Clinic Address">
                        <Input
                            type="text"
                            name="clinic_address"
                            value={formData.clinic_address}
                            onChange={(e) => setFormData({ ...formData, clinic_address: e.target.value })}
                            disabled={!isEditing}
                        />
                    </FormGroup>
                </div>
            </div>

            <div className="flex justify-start mt-6 gap-4">
                {!isEditing ? (
                    <SaveButton text="Edit" colorClass="bg-blue-600 hover:bg-blue-700" onClick={() => setIsEditing(true)} />
                ) : (
                    <>
                        {hasChanges && (
                            <SaveButton
                                text={isSaving ? "Updating..." : "Update Logistics"}
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

export default ConsultationLogisticsForm;