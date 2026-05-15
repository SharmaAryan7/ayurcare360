import React, { useState, useEffect } from 'react';
import { Video, XCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const PatientActionSidebar = ({ actions, onCancelClick }) => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 1. Setup real-time state
  const [now, setNow] = useState(new Date());

  // 2. Timer to re-evaluate the time window every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const status = actions?.status;

  // 3. Parse Dates safely
  const startTime = (actions?.start_time || actions?.scheduled_at) ? new Date(actions?.start_time || actions?.scheduled_at) : null;

  // If no explicit end_time, assume standard duration is 30 mins
  const endTime = actions?.end_time ? new Date(actions?.end_time) : (startTime ? new Date(startTime.getTime() + 30 * 60000) : null);

  // 4. Calculate Time Windows
  // Allow joining 5 minutes early
  const joinStartTime = startTime ? new Date(startTime.getTime() - 5 * 60000) : null;

  const isTimeValid = (joinStartTime && endTime) ? (now >= joinStartTime && now <= endTime) : false;
  const isPast = endTime ? (now > endTime) : false;

  const isJoinable = (status === 'Scheduled' || status === 'InProgress') && isTimeValid;

  const handleJoinCall = () => {
    if (isJoinable) {
      navigate(`/patient/consultation/room/${id}`);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#EFEBE1]">
      <h3 className="text-sm font-extrabold text-gray-400 tracking-widest uppercase mb-6">Actions</h3>

      <div className="flex flex-col gap-4">
        {/* Dynamic State Transition: If the slot time is over or status is updated, remove the buttons */}
        {isPast || status === 'Completed' || status === 'Cancelled' ? (
          <div className={`w-full py-5 rounded-xl font-bold flex flex-col items-center justify-center gap-2 ${status === 'Cancelled' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-[#4A7C59]'}`}>
            {status === 'Cancelled' ? <XCircle size={24} /> : <CheckCircle size={24} />}
            <span className="text-sm">{status === 'Cancelled' ? 'Consultation Cancelled' : 'Consultation Completed'}</span>
          </div>
        ) : (
          <>
            <button
              onClick={handleJoinCall}
              disabled={!isJoinable}
              className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isJoinable ? 'bg-[#52735B] hover:bg-[#435e4a] text-white shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <Video size={18} />
              {!isTimeValid ? 'Waiting for Slot Time' : 'Join Consultation'}
            </button>

            <button
              onClick={onCancelClick}
              className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border border-red-100 text-red-500 hover:bg-red-50"
            >
              <XCircle size={18} />
              Cancel Appointment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientActionSidebar;