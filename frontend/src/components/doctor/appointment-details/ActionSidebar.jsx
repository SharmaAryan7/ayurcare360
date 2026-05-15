import React, { useState } from 'react';
import { Video, Calendar as CalendarIcon, XCircle } from 'lucide-react';
import { doctorApi } from '../../../api/doctorApi';

const ActionSidebar = ({ appointmentId, appointment }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [isStarting, setIsStarting] = useState(false);

    const isCancelled = appointment?.status === 'Cancelled';
    const isCompleted = appointment?.status === 'Completed';

    const handleStartVideo = async () => {
        setIsStarting(true);
        try {
            const res = await doctorApi.startVideoConsultation(appointmentId);
            if (res.success && res.link) {
                window.open(res.link, '_blank');
            }
        } catch (error) {
            console.error("Failed to start consultation", error);
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
        <div className="flex flex-col gap-4 bg-[#f4eedd] p-10 rounded-3xl h-64">
            <button
                onClick={handleStartVideo}
                disabled={isCancelled || isCompleted || isStarting}
                className="w-full text-sm bg-[#4A7C59] hover:bg-[#3a6146] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-full font-bold transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
                <Video size={14} />
                <span>{isStarting ? 'Starting...' : 'Start Video Consultation'}</span>
            </button>

            <button
                disabled={isCancelled || isCompleted}
                className="w-full text-sm bg-[#8A79AF] hover:bg-[#726394] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 px-6 rounded-full font-bold transition-colors flex items-center justify-center gap-3 shadow-sm"
            >
                <CalendarIcon size={14} />
                <span>Reschedule</span>
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