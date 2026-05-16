import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageSquare, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import DoctorSelectionCard from '../../components/patient/book-appointment/DoctorSelectionCard';
import AllPractitionersModal from '../../components/patient/book-appointment/AllPractitionersModal';
import TimeSlotSelector from '../../components/patient/book-appointment/TimeSlotSelector';

import { appointmentApi } from '../../api/appointmentApi';

const BookAppointmentPage = () => {
  const navigate = useNavigate();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  const [doctors, setDoctors] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(todayStr);
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');

  const [isPractitionersModalOpen, setIsPractitionersModalOpen] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const response = await appointmentApi.getAllPractitioners();
        const fetchedDoctors = response.practitioners || response || [];
        setDoctors(fetchedDoctors);

        if (fetchedDoctors.length > 0) {
          setSelectedDoctorId(fetchedDoctors[0].doctor_id || fetchedDoctors[0].id || fetchedDoctors[0]._id);
        }
      } catch (err) {
        setError("Unable to load practitioners. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!selectedDoctorId || !selectedDate) return;
    const fetchDynamicSlots = async () => {
      try {
        setSlotsLoading(true);
        setSelectedTime('');
        const response = await appointmentApi.getAvailableSlots(selectedDoctorId, selectedDate);
        setTimeSlots(response.slots || response || []);
      } catch (err) {
        console.error("Failed to load time slots", err);
        setTimeSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchDynamicSlots();
  }, [selectedDoctorId, selectedDate]);

  const selectedDoctor = doctors.find(doc => (doc.doctor_id || doc.id || doc._id) === selectedDoctorId) || null;
  const baseFee = selectedDoctor?.consultation_fee ? parseFloat(selectedDoctor.consultation_fee) : 50.00;
  const taxAmount = baseFee > 0 ? (baseFee * 0.18) : 0;
  const totalAmount = (baseFee + taxAmount).toFixed(2);

  const handleConfirmAppointment = (e) => {
    e.preventDefault(); 
    if (!selectedDoctorId || !selectedTime || !reason.trim()) return;

    const payload = {
      bookingData: {
        doctorId: selectedDoctorId,
        doctorName: selectedDoctor?.name || selectedDoctor?.full_name ? `Dr. ${selectedDoctor?.full_name || selectedDoctor?.name}` : 'Selected Practitioner',
        date: selectedDate,
        time: selectedTime,
        reason: reason
      },
      financials: {
        fee: baseFee.toFixed(2),
        tax: taxAmount.toFixed(2),
        total: totalAmount
      }
    };

    sessionStorage.setItem('pendingAppointment', JSON.stringify(payload));
    
    // THE FIX: We MUST pass "fromAppointmentSetup: true" so StrictFlowRoute doesn't block us!
    navigate('/patient/consultation/payment', { 
      state: { ...payload, fromAppointmentSetup: true } 
    });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#FDF9EE]"><Loader2 className="w-10 h-10 text-green-700 animate-spin" /></div>;
  if (error) return <div className="flex items-center justify-center min-h-screen bg-[#FDF9EE]"><div className="text-red-600 bg-red-50 px-6 py-4 rounded-xl border border-red-200 font-medium">{error}</div></div>;

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto">
      <AllPractitionersModal isOpen={isPractitionersModalOpen} onClose={() => setIsPractitionersModalOpen(false)} onSelectDoctor={(id) => { setSelectedDoctorId(id); setIsPractitionersModalOpen(false); }} doctors={doctors} />

      <div className="mb-10">
        <h1 className="text-4xl md:text-[40px] font-extrabold text-gray-900 mb-3 tracking-tight">Book Appointment</h1>
        <p className="text-gray-500 font-medium text-base">Select your practitioner and schedule a session that fits your wellness journey.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <div className="lg:col-span-2 space-y-10 overflow-hidden">
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Doctor Selection</h2>
              <button onClick={() => setIsPractitionersModalOpen(true)} className="text-[#4A7C59] font-semibold text-sm hover:underline cursor-pointer">View All Practitioners</button>
            </div>
            <div className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden">
              {doctors.map(doctor => {
                const docId = doctor.doctor_id || doctor.id || doctor._id;
                return (
                  <div key={docId} className="snap-start shrink-0">
                    <DoctorSelectionCard doctor={doctor} isSelected={selectedDoctorId === docId} onSelect={() => setSelectedDoctorId(docId)} />
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reason for Visit</h2>
            <div className="bg-white rounded-[24px] p-6 md:p-8 border border-[#EFEBE1] shadow-sm">
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Symptoms or Consultation Goal</label>
              <textarea
                rows="4"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full bg-[#FAF7F2] border border-[#EFEBE1] rounded-2xl p-5 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4A7C59] resize-none transition-colors"
                placeholder="Please describe your symptoms..."
              />
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-[32px] p-8 border border-[#EFEBE1] shadow-sm mb-6">

            <TimeSlotSelector
              selectedDate={selectedDate}
              minDate={todayStr}
              maxDate={maxDateStr}
              onDateChange={setSelectedDate}
              slots={timeSlots}
              selectedTime={selectedTime}
              onSelectTime={setSelectedTime}
              isLoading={slotsLoading}
            />

            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-5">Appointment Summary</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Consultation</span>
                <span className="text-gray-900 font-bold">₹{baseFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Tax & Fees</span>
                <span className="text-gray-900 font-bold">₹{taxAmount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-[#EFEBE1] mb-8">
              <span className="text-base font-bold text-gray-900">Total Amount</span>
              <span className="text-2xl font-extrabold text-gray-900">₹{totalAmount}</span>
            </div>

            <button
              type='button'
              onClick={handleConfirmAppointment}
              disabled={!selectedDoctorId || !selectedTime || !reason.trim()}
              className={`w-full text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors ${(!selectedDoctorId || !selectedTime || !reason.trim())
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-[#3A6447] hover:bg-[#2C4D36]'
                }`}
            >
              <ShieldCheck size={18} />
              Review & Confirm Booking
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-4 px-4 leading-relaxed">
              Review your details on the next page to confirm your booking.
            </p>
          </div>

          <div className="bg-[#79563E] rounded-[24px] p-6 relative overflow-hidden text-white shadow-sm">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full"></div>
            <h4 className="text-lg font-bold mb-2 relative z-10">Prakriti Analysis</h4>
            <p className="text-sm text-white/80 leading-relaxed mb-4 relative z-10 pr-4">Book a session to discover your unique constitution.</p>
            <div className="flex items-center gap-2 text-[#E8C8A0] text-xs font-bold uppercase tracking-wider relative z-10 cursor-pointer hover:text-white transition-colors">
              <MessageSquare size={14} /> Live Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointmentPage;