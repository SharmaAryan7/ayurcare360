import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { appointmentApi } from '../../api/appointmentApi';

import AppointmentSummaryCard from '../../components/patient/appointment-details/AppointmentSummaryCard';
import PatientActionSidebar from '../../components/patient/appointment-details/PatientActionSidebar';
import PreparationNotesCard from '../../components/patient/appointment-details/PreparationNotesCard';
import DoctorInfoCard from '../../components/patient/appointment-details/DoctorInfoCard';
import DocumentsList from '../../components/patient/appointment-details/DocumentsList';
import CancelAppointmentModal from '../../components/patient/appointment-details/CancelAppointmentModal';
import CancelSuccessModal from '../../components/patient/appointment-details/CancelSuccessModal';

const PatientAppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [actions, setActions] = useState(null);
    const [symptoms, setSymptoms] = useState(null);
    const [practitioner, setPractitioner] = useState(null);
    const [documents, setDocuments] = useState([]);
    
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isCancelSuccessOpen, setIsCancelSuccessOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const fetchAllDetails = async () => {
            if (!id) return;
            try {
                setLoading(true);
                let [actionsData, symptomsData, practitionerData, documentsData] = await Promise.all([
                    appointmentApi.getActions(id),
                    appointmentApi.getSymptoms(id),
                    appointmentApi.getPractitionerInfo(id),
                    appointmentApi.getDocuments(id).catch(() => [])
                ]);

                // FRONTEND TIME-CHECK LOGIC (Override Status if time has passed)
                if (actionsData && (actionsData.status === 'Scheduled' || actionsData.status === 'Pending')) {
                    const now = new Date();
                    const dateStr = actionsData.appointment_date || actionsData.date || actionsData.start_time;
                    const timeStr = actionsData.appointment_time || actionsData.time || '';

                    if (dateStr) {
                        const cleanDate = dateStr.split('T')[0];
                        const fullDateTimeStr = timeStr ? `${cleanDate}T${timeStr}` : cleanDate;
                        const aptDate = new Date(fullDateTimeStr);

                        // Add 60 minutes buffer
                        const completionTime = new Date(aptDate.getTime() + (35 * 60 * 1000));

                        if (now > completionTime) {
                            actionsData = { ...actionsData, status: 'Completed' };
                        }
                    }
                }

                setActions(actionsData);
                setSymptoms(symptomsData);
                setPractitioner(practitionerData);
                setDocuments(documentsData || []);
            } catch (error) {
                console.error("Failed to load appointment details:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllDetails();
    }, [id]);

    const handleConfirmCancellation = async () => {
        try {
            setIsCancelling(true);
            await appointmentApi.cancelAppointment(id);
            setIsCancelModalOpen(false);
            setIsCancelSuccessOpen(true);
            
            setActions(prev => ({ ...prev, status: 'Cancelled' }));
        } catch (error) {
            console.error("Cancel Error:", error);
            alert("Failed to cancel appointment. Please try again.");
        } finally {
            setIsCancelling(false);
        }
    };

    const displayId = id ? `APT-${id.substring(0, 8).toUpperCase()}` : 'Loading...';

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF9EE] flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-[#4A7C59] animate-spin" />
            </div>
        );
    }

    return (
        <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full relative">
            <CancelAppointmentModal 
                isOpen={isCancelModalOpen} 
                onClose={() => setIsCancelModalOpen(false)} 
                onConfirm={handleConfirmCancellation} 
                isProcessing={isCancelling}
            />
            <CancelSuccessModal 
                isOpen={isCancelSuccessOpen} 
                onGoDashboard={() => navigate('/patient/dashboard')} 
                onScheduleNew={() => navigate('/patient/book-appointment')} 
            />

            <div className="mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Appointment Details</h1>
                <div className="flex items-center text-gray-500 text-sm font-bold tracking-wide">
                    <Link to="/patient/appointments" className="hover:text-[#4A7C59] transition-colors">Appointments</Link>
                    <ChevronRight size={16} className="mx-2" />
                    <span className="text-gray-900 font-extrabold">{displayId}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                <div className="lg:col-span-2">
                    {practitioner && actions ? <AppointmentSummaryCard practitioner={practitioner} actions={actions} /> : null}
                </div>

                <div className="lg:col-span-1">
                    {actions ? <PatientActionSidebar actions={actions} onCancelClick={() => setIsCancelModalOpen(true)} /> : null}
                </div>

                <div className="lg:col-span-2">
                    {symptoms ? <PreparationNotesCard notes={symptoms.chief_complaint || symptoms.pre_consultation_symptoms} /> : null}
                </div>

                <div className="lg:col-span-1">
                    {practitioner ? <DoctorInfoCard info={practitioner} /> : null}
                </div>

                <div className="lg:col-span-3">
                    <DocumentsList documents={documents} />
                </div>
            </div>
        </div>
    );
};

export default PatientAppointmentDetails;