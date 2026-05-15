import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, Calendar, Video } from 'lucide-react';
import { doctorApi } from '../../api/doctorApi';

import StatCard from '../../components/doctor/dashboard/StatCard';
import UpcomingAppointmentsTable from '../../components/doctor/dashboard/UpcomingAppointmentsTable';
import EarningsSummaryCard from '../../components/doctor/dashboard/EarningsSummaryCard';

const DoctorDashboard = () => {
    const { searchQuery = '' } = useOutletContext() || {};
    const [isLoading, setIsLoading] = useState(true);

    const [totalPatients, setTotalPatients] = useState(0);
    const [appointmentsToday, setAppointmentsToday] = useState(0);
    const [upcomingConsultations, setUpcomingConsultations] = useState(0);
    const [upcomingAppointmentsList, setUpcomingAppointmentsList] = useState([]);
    const [earnings, setEarnings] = useState({ total: 0, monthly: 0 });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [ptsRes, todayRes, upcomingRes, listRes, earnRes] = await Promise.all([
                    doctorApi.getTotalPatients(),
                    doctorApi.getAppointmentsToday(),
                    doctorApi.getUpcomingConsultations(),
                    doctorApi.getRecentUpcomingAppointments(),
                    doctorApi.getEarningSummary()
                ]);

                if (ptsRes.success) setTotalPatients(ptsRes.totalPatients);
                if (todayRes.success) setAppointmentsToday(todayRes.appointmentsToday);
                if (upcomingRes.success) setUpcomingConsultations(upcomingRes.upcomingConsultations);
                if (listRes.success) setUpcomingAppointmentsList(listRes.appointments || []);
                if (earnRes.success) setEarnings(earnRes.earnings);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const filteredAppointments = upcomingAppointmentsList.filter(apt =>
        (apt.patient_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#FDF9EE]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59]"></div>
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Dashboard</h1>
                <p className="text-gray-500 text-xs">
                    Welcome back. You have <span className="font-bold text-gray-700">{appointmentsToday} consultations</span> scheduled for today.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                <StatCard
                    title="Total Patients"
                    value={totalPatients.toLocaleString()}
                    icon={<Users size={16} />}
                    iconBgColor="bg-blue-50"
                    iconTextColor="text-blue-600"
                />
                <StatCard
                    title="Appointments Today"
                    value={appointmentsToday}
                    icon={<Calendar size={16} />}
                    iconBgColor="bg-orange-50"
                    iconTextColor="text-orange-500"
                />
                <StatCard
                    title="Upcoming Consultations"
                    value={upcomingConsultations}
                    icon={<Video size={16} />}
                    iconBgColor="bg-purple-50"
                    iconTextColor="text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2">
                <UpcomingAppointmentsTable appointments={filteredAppointments} />
                <EarningsSummaryCard earnings={earnings} />
            </div>
        </div>
    );
};

export default DoctorDashboard;