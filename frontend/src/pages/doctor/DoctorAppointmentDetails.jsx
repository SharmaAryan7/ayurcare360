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

                if (infoRes.success) setPatientInfo(infoRes.info);
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

    if (!patientInfo) return <div className="p-10 text-gray-500">Appointment not found.</div>;

    const filteredReports = reports.filter(report =>
        (report.document_name || '').toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
            <div className="mb-10">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">Appointment Details</h1>
                <div className="flex items-center text-gray-500 text-sm font-bold tracking-wide">
                    <Link to="/doctor/appointments" className="hover:text-[#4A7C59] transition-colors">Appointments</Link>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-gray-900">{patientInfo.patient_name}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <PatientSummaryCard appointment={patientInfo} />
                </div>
                <div className="lg:col-span-1">
                    <ActionSidebar appointment={patientInfo} appointmentId={id} />
                </div>
                <div className="lg:col-span-2">
                    <SymptomsCard symptoms={symptoms?.pre_consultation_symptoms || 'No symptoms reported by the patient.'} />
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