import React, { useState, useEffect } from 'react';
import { useParams, Link, useOutletContext } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { doctorApi } from '../../api/doctorApi';

import PatientSummaryCard from '../../components/doctor/appointment-details/PatientSummaryCard';
import ActionSidebar from '../../components/doctor/appointment-details/ActionSidebar';
import SymptomsCard from '../../components/doctor/appointment-details/SymptomsCard';
import MedicalInfoCard from '../../components/doctor/appointment-details/MedicalInfoCard';
import ReportsList from '../../components/doctor/appointment-details/ReportsList';

const DoctorAppointmentDetails = () => {
    const { id } = useParams();
    const { searchQuery = '' } = useOutletContext() || {};
    const [isLoading, setIsLoading] = useState(true);

    const [patientInfo, setPatientInfo] = useState(null);
    const [symptoms, setSymptoms] = useState(null);
    const [medicalInfo, setMedicalInfo] = useState(null);
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchAllDetails = async () => {
            setIsLoading(true);
            try {
                const [infoRes, sympRes, medRes, repRes] = await Promise.all([
                    doctorApi.getApptPatientInfo(id),
                    doctorApi.getApptSymptoms(id),
                    doctorApi.getApptMedicalInfo(id),
                    doctorApi.getApptReports(id)
                ]);

                // THE FIX: Single Appointment Time-Check Logic
                if (infoRes.success) {
                    let aptData = infoRes.info;
                    const status = aptData.status || 'Scheduled';
                    if (status === 'Scheduled' || status === 'Pending' || status === 'Confirmed') {
                        const now = new Date();
                        let aptDate = null;
                        const rawDateStr = aptData.appointment_date || aptData.start_time;
                        const rawTimeStr = aptData.appointment_time || aptData.time;

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
                                aptData = { ...aptData, status: 'Completed' }; // Disable action buttons by overriding status
                            }
                        }
                    }
                    setPatientInfo(aptData);
                }

                if (sympRes.success) setSymptoms(sympRes.symptoms);
                if (medRes.success) setMedicalInfo(medRes.medicalInfo);
                if (repRes.success) setReports(repRes.reports || []);

            } catch (error) {
                console.error("Failed to load appointment details", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAllDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[60vh] bg-[#FDF9EE]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A7C59]"></div>
            </div>
        );
    }

    if (!patientInfo) return <div className="p-4 sm:p-10 text-gray-500 text-center sm:text-left font-medium">Appointment not found.</div>;

    const filteredReports = reports.filter(report =>
        (report.document_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displaySymptoms = symptoms?.pre_consultation_symptoms || symptoms?.chief_complaint || patientInfo?.reason_for_visit || 'No symptoms reported by the patient.';

    return (
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 bg-[#FDF9EE] min-h-full overflow-x-hidden">
            <div className="mb-6 lg:mb-10 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2 sm:mb-3 tracking-tight">Appointment Details</h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start text-gray-500 text-xs sm:text-sm font-bold tracking-wide">
                    <Link to="/doctor/appointments" className="hover:text-[#4A7C59] transition-colors">Appointments</Link>
                    <ChevronRight size={14} className="mx-1 sm:mx-2" />
                    <span className="text-gray-900 truncate">{patientInfo.patient_name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                <div className="lg:col-span-2">
                    <PatientSummaryCard appointment={patientInfo} />
                </div>
                <div className="lg:col-span-1">
                    <ActionSidebar appointment={patientInfo} appointmentId={id} />
                </div>
                <div className="lg:col-span-2">
                    <SymptomsCard symptoms={displaySymptoms} />
                </div>
                <div className="lg:col-span-1">
                    <MedicalInfoCard info={medicalInfo} />
                </div>
                <div className="lg:col-span-3">
                    <ReportsList reports={filteredReports} appointmentId={id} />
                </div>
            </div>
        </div>
    );
}

export default DoctorAppointmentDetails;