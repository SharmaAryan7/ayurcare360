import React, { useState } from 'react';
import { Video, XCircle } from 'lucide-react';
import { doctorApi } from '../../../api/doctorApi';
import { useNavigate } from 'react-router-dom'; 

const ActionSidebar = ({ appointmentId, appointment }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [isStarting, setIsStarting] = useState(false);
    
    const navigate = useNavigate();

    const isCancelled = appointment?.status === 'Cancelled';
    const isCompleted = appointment?.status === 'Completed';

    const handleStartVideo = async () => {
        setIsStarting(true);
        try {
            const res = await doctorApi.startVideoConsultation(appointmentId);
            
            if (res.success) {
                navigate(`/doctor/consultation/room/${appointmentId}`);
            }
        } catch (error) {
            console.error("Failed to start consultation", error);
            alert("Unable to connect to the consultation room. Please try again.");
        } finally {
            setIsStarting(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;
        setIsCancelling(true);
        try {
            await doctorApi.cancelAppointment(appointmentId);
            window.location.reload(); // Refresh to reflect status update
        } catch (error) {
            console.error("Failed to cancel appointment", error);
        } finally {
            setIsCancelling(false);
        }
    };

    return (
        <div className="flex flex-col gap-4 bg-[#f4eedd] p-10 rounded-3xl h-auto">
            <button
                onClick={handleStartVideo}
                disabled={isCancelled || isCompleted || isStarting}
                className="w-full text-sm bg-[#4A7C59] hover:bg-[#3a6146] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-full font-bold transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
                <Video size={14} />
                <span>{isStarting ? 'Starting...' : 'Start Video Consultation'}</span>
            </button>

            <button
                onClick={handleCancel}
                disabled={isCancelled || isCompleted || isCancelling}
                className="w-full text-sm bg-orange-50/50 border border-orange-100 text-orange-600 hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed py-4 px-6 rounded-full font-bold transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
                <XCircle size={14} />
                <span>{isCancelling ? 'Cancelling...' : 'Cancel Appointment'}</span>
            </button>
        </div>
    );
};

export default ActionSidebar;