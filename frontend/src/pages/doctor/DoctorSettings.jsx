import React, { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';

import PersonalInformationForm from '../../components/doctor/settings/PersonalInformationForm';
import ProfessionalCredentialsForm from '../../components/doctor/settings/ProfessionalCredentialsForm';
import PreferencesForm from '../../components/doctor/settings/PreferencesForm';
import ConsultationLogisticsForm from '../../components/doctor/settings/ConsultationLogisticsForm';
import PhilosophyOfCareForm from '../../components/doctor/settings/PhilosophyOfCareForm';
import AccountSecurityForm from '../../components/doctor/settings/AccountSecurityForm';

const DoctorSettings = () => {
    const [isLoading, setIsLoading] = useState(true);

    // Manage all specific sub-sections state
    const [personalInfo, setPersonalInfo] = useState(null);
    const [preferences, setPreferences] = useState(null);
    const [credentials, setCredentials] = useState(null);
    const [logistics, setLogistics] = useState(null);
    const [philosophy, setPhilosophy] = useState('');

    useEffect(() => {
        const fetchAllSettings = async () => {
            setIsLoading(true);
            try {
                const [personalRes, prefRes, credRes, logRes, philRes] = await Promise.all([
                    doctorApi.getSettingsPersonalInfo(),
                    doctorApi.getPreferences(),
                    doctorApi.getProfessionalCredentials(),
                    doctorApi.getConsultationLogistics(),
                    doctorApi.getPhilosophyOfCare()
                ]);

                if (personalRes.success) setPersonalInfo(personalRes.info);
                if (prefRes.success) setPreferences(prefRes.preferences);
                if (credRes.success) setCredentials(credRes.credentials);
                if (logRes.success) setLogistics(logRes.logistics);
                if (philRes.success) setPhilosophy(philRes.philosophy);

            } catch (error) {
                console.error("Error fetching settings data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllSettings();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#FDF9EE]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full flex flex-col gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Settings</h1>
                <p className='text-sm'>Manage your clinical profile, credentials, and consultation preferences.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* --- ROW 1 --- */}
                {personalInfo && <PersonalInformationForm data={personalInfo} />}
                {preferences && <PreferencesForm data={preferences} />}

                {/* --- ROW 2 --- */}
                {credentials && <ProfessionalCredentialsForm data={credentials} />}
                {logistics && <ConsultationLogisticsForm data={logistics} />}

                {/* --- ROW 3 --- (Spans full width) */}
                <div className="lg:col-span-2">
                    <PhilosophyOfCareForm data={{ philosophy_of_care: philosophy }} />
                </div>

                {/* --- ROW 4 --- (Spans full width) */}
                <div className="lg:col-span-2">
                    <AccountSecurityForm />
                </div>
            </div>
        </div>
    );
};

export default DoctorSettings;