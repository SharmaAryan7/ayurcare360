import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { doctorApi } from '../../api/doctorApi';

import AppointmentsHeader from '../../components/doctor/appointments/AppointmentsHeader';
import AppointmentsTabs from '../../components/doctor/appointments/AppointmentsTabs';
import AppointmentsTable from '../../components/doctor/appointments/AppointmentsTable';

const DoctorAppointments = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('Upcoming');
    const [appointments, setAppointments] = useState([]);

    const tabsArray = ['All', 'Today', 'Upcoming', 'Completed', 'Cancelled'];

    useEffect(() => {
        const fetchAppointments = async () => {
            setIsLoading(true);
            try {
                let res;
                switch (activeTab) {
                    case 'All': res = await doctorApi.getAllAppointments(); break;
                    case 'Today': res = await doctorApi.getTodayAppointments(); break;
                    case 'Upcoming': res = await doctorApi.getUpcomingAppointments(); break;
                    case 'Completed': res = await doctorApi.getCompletedAppointments(); break;
                    case 'Cancelled': res = await doctorApi.getCancelledAppointments(); break;
                    default: res = await doctorApi.getAllAppointments();
                }

                // THE FIX: Frontend Time-Check logic applied to the array
                if (res && res.success) {
                    const now = new Date();
                    const processedAppointments = (res.appointments || []).map(apt => {
                        const status = apt.status || 'Scheduled';
                        if (status === 'Scheduled' || status === 'Pending' || status === 'Confirmed') {
                            let aptDate = null;
                            const rawDateStr = apt.appointment_date || apt.start_time;
                            const rawTimeStr = apt.appointment_time || apt.time;

                            if (rawDateStr) {
                                if (typeof rawDateStr === 'string' && rawDateStr.includes('T')) {
                                    aptDate = new Date(rawDateStr); // Keep 'Z' intact
                                } else if (rawDateStr && rawTimeStr) {
                                    const cleanDate = rawDateStr.split('T')[0];
                                    aptDate = new Date(`${cleanDate}T${rawTimeStr.trim()}`);
                                } else {
                                    aptDate = new Date(rawDateStr);
                                }
                            }

                            if (aptDate && !isNaN(aptDate.getTime())) {
                                const completionTime = new Date(aptDate.getTime() + (35 * 60 * 1000));
                                if (now > completionTime) {
                                    return { ...apt, status: 'Completed' }; // Override to Completed
                                }
                            }
                        }
                        return apt;
                    });
                    
                    // Extra cleanup to remove 'Completed' from 'Upcoming' tab visually
                    if (activeTab === 'Upcoming') {
                        setAppointments(processedAppointments.filter(a => a.status !== 'Completed'));
                    } else {
                        setAppointments(processedAppointments);
                    }
                } else {
                    setAppointments([]);
                }
            } catch (error) {
                console.error("Error fetching appointments:", error);
                setAppointments([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAppointments();
    }, [activeTab]);

    const filteredAppointments = appointments.filter(apt => {
        const patientName = (apt.patient_name || '').toLowerCase();
        return patientName.includes(searchQuery.toLowerCase());
    });

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
            <AppointmentsHeader />
            <AppointmentsTabs tabs={tabsArray} activeTab={activeTab} onTabChange={setActiveTab} />

            {isLoading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4A7C59]"></div>
                </div>
            ) : (
                <AppointmentsTable appointments={filteredAppointments} activeTab={activeTab} />
            )}
        </div>
    );
};

export default DoctorAppointments;