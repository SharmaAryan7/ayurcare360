import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import { patientApi } from '../../api/patientApi';
import { appointmentApi } from '../../api/appointmentApi'; 

import PatientProfileSummary from '../../components/patient/dashboard/PatientProfileSummary';
import UpcomingAppointmentCard from '../../components/patient/dashboard/UpcomingAppointmentCard';
import WeightTracker from '../../components/patient/dashboard/WeightTracker';
import WellnessActivity from '../../components/patient/dashboard/WellnessActivity';
import MedicalHistory from '../../components/patient/dashboard/MedicalHistory';
import QuickMetrics from '../../components/patient/dashboard/QuickMetrics';

const PatientDashboard = () => {
  const { globalProfile, isLoadingProfile } = useOutletContext();

  const [location, setLocation] = useState(undefined);
  const [upcoming, setUpcoming] = useState(undefined);
  const [weightData, setWeightData] = useState(undefined);
  const [activity, setActivity] = useState(undefined);
  const [history, setHistory] = useState(undefined);
  const [metrics, setMetrics] = useState(undefined);

  useEffect(() => {
    const fetchDashboardData = async () => {
      
      patientApi.getProfileContact()
        .then(data => {
          if (data && data.address) {
            const parts = data.address.split(',');
            setLocation(parts.length > 1 ? parts[1].trim() : data.address);
          } else {
            setLocation(null);
          }
        })
        .catch(() => setLocation(null));

      appointmentApi.getUpcoming()
        .then(res => {
          const appointments = res.appointments || res.data || res || [];
          const now = new Date();
          
          const trulyUpcomingAppts = appointments.filter(apt => {
            const currentStatus = apt.status || apt.appointment_status;
            
            if (currentStatus !== 'Scheduled' && currentStatus !== 'Pending' && currentStatus !== 'Confirmed') {
                return false;
            }

            let aptDate = null;
            const rawDateStr = apt.start_time || apt.scheduled_at || apt.appointment_date || apt.date;
            const rawTimeStr = apt.appointment_time || apt.time;

            if (rawDateStr) {
                if (typeof rawDateStr === 'string' && rawDateStr.includes('T')) {
                    aptDate = new Date(rawDateStr); // THE FIX: Kept Z intact
                } else if (rawDateStr && rawTimeStr) {
                    const cleanDate = rawDateStr.split('T')[0];
                    aptDate = new Date(`${cleanDate}T${rawTimeStr.trim()}`);
                } else {
                    aptDate = new Date(rawDateStr);
                }
            }

            if (aptDate && !isNaN(aptDate.getTime())) {
                const completionTime = new Date(aptDate.getTime() + (35 * 60 * 1000));
                if (now > completionTime) return false;
            }
            
            return true;
          });
          
          if (trulyUpcomingAppts.length > 0) {
            trulyUpcomingAppts.sort((a, b) => {
              const rawA = a.appointment_date || a.date || a.start_time || a.scheduled_at || '';
              const rawB = b.appointment_date || b.date || b.start_time || b.scheduled_at || '';
              const dateA = new Date(rawA);
              const dateB = new Date(rawB);
              return dateA - dateB;
            });

            const next = trulyUpcomingAppts[0];
            
            let scheduledAtDate = new Date();
            const rawDateStr = next.start_time || next.scheduled_at || next.appointment_date || next.date;
            const rawTimeStr = next.appointment_time || next.time;

            if (rawDateStr) {
                if (typeof rawDateStr === 'string' && rawDateStr.includes('T')) {
                    scheduledAtDate = new Date(rawDateStr);
                } else if (rawDateStr && rawTimeStr) {
                    const cleanDate = rawDateStr.split('T')[0];
                    scheduledAtDate = new Date(`${cleanDate}T${rawTimeStr.trim()}`);
                } else {
                    scheduledAtDate = new Date(rawDateStr);
                }
            }

            setUpcoming({
              id: next.id || next.appointment_id,
              scheduled_at: scheduledAtDate.toISOString(),
              mode: next.consultation_type || next.mode || 'Video',
              doctorName: next.doctor_name || next.doctorName || 'Your Doctor',
              specialty: next.specialization || next.specialty || 'Ayurvedic Practitioner',
              avatar: next.patient_avatar || next.avatar || next.profile_image_url || next.patient_image || null
            });
          } else {
            setUpcoming(null);
          }
        })
        .catch((e) => {
          console.log("Upcoming Appointment Fetch bypassed:", e);
          setUpcoming(null);
        });

      await Promise.all([
        patientApi.getDashWeightTracker()
          .then(data => setWeightData(data || []))
          .catch(() => setWeightData([])), 

        patientApi.getDashWellnessActivity()
          .then(data => setActivity(data || []))
          .catch(() => setActivity([])), 

        patientApi.getDashMedicalHistory()
          .then(data => setHistory(data || {}))
          .catch(() => setHistory({})), 

        patientApi.getDashQuickMetrics()
          .then(data => setMetrics(data || []))
          .catch(() => setMetrics([])) 
      ]);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-10 bg-[#FDF9EE] min-h-full overflow-x-hidden">
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-10">
        <div className="lg:col-span-2">
          <PatientProfileSummary profile={globalProfile || {}} location={location} isLoading={isLoadingProfile} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingAppointmentCard appointment={upcoming} isLoading={upcoming === undefined} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-10">
        <WeightTracker weightData={weightData || []} profileWeight={globalProfile?.weight_kg} isLoading={weightData === undefined || isLoadingProfile} />
        <WellnessActivity activityData={activity || []} isLoading={activity === undefined} />
      </div>

      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 pb-4 lg:pb-2">
        <MedicalHistory history={history || {}} isLoading={history === undefined} />
        <QuickMetrics metrics={metrics || []} isLoading={metrics === undefined} />
      </div>
    </div>
  );
};

export default PatientDashboard;