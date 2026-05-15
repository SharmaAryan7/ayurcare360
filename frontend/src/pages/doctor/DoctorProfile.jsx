import React, { useState, useEffect } from 'react';
import { doctorApi } from '../../api/doctorApi';

import ProfileHeaderCard from '../../components/doctor/profile/ProfileHeaderCard';
import ConsultationFeeCard from '../../components/doctor/profile/ConsultationFeeCard';
import ContactInfoCard from '../../components/doctor/profile/ContactInfoCard';
import CredentialsCard from '../../components/doctor/profile/CredentialsCard';
import PhilosophyCard from '../../components/doctor/profile/PhilosophyCard';

const DoctorProfile = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [profileData, setProfileData] = useState({
        personal: null,
        contact: null,
        credentials: null,
        philosophy: null,
        logistics: null, // needed for consultation fee
    });

    useEffect(() => {
        const fetchProfileData = async () => {
            setIsLoading(true);
            try {
                const [personalRes, contactRes, credentialsRes, philosophyRes, logisticsRes] = await Promise.all([
                    doctorApi.getProfilePersonalInfo(),
                    doctorApi.getContactInfo(),
                    doctorApi.getCredentials(),
                    doctorApi.getPhilosophy(),
                    doctorApi.getConsultationLogistics() // Need fee for ConsultationFeeCard
                ]);

                setProfileData({
                    personal: personalRes.success ? personalRes.info : null,
                    contact: contactRes.success ? contactRes.info : null,
                    credentials: credentialsRes.success ? credentialsRes.credentials : null,
                    philosophy: philosophyRes.success ? philosophyRes.philosophy : null,
                    logistics: logisticsRes.success ? logisticsRes.logistics : null
                });

            } catch (error) {
                console.error("Failed to fetch profile data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#FDF9EE]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59]"></div>
            </div>
        );
    }

    if (!profileData.personal) return <div className="p-10 text-gray-500">Profile data unavailable.</div>;

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full flex flex-col gap-8">
            {/* Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <ProfileHeaderCard profile={profileData.personal} />
                <ConsultationFeeCard logistics={profileData.logistics} />
            </div>

            {/* Middle Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <ContactInfoCard contact={profileData.contact} />
                <CredentialsCard credentials={profileData.credentials} />
                <PhilosophyCard philosophy={profileData.philosophy} />
            </div>
        </div>
    );
};

export default DoctorProfile;