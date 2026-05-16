import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom'; 
import { patientApi } from '../../api/patientApi';
import { appointmentApi } from '../../api/appointmentApi'; // INJECTED MAIN APPOINTMENT API

import PatientProfileSummary from '../../components/patient/dashboard/PatientProfileSummary';
import UpcomingAppointmentCard from '../../components/patient/dashboard/UpcomingAppointmentCard';
import WeightTracker from '../../components/patient/dashboard/WeightTracker';
import WellnessActivity from '../../components/patient/dashboard/WellnessActivity';
import MedicalHistory from '../../components/patient/dashboard/MedicalHistory';
import QuickMetrics from '../../components/patient/dashboard/QuickMetrics';

const PatientDashboard = () => {
  // Grab the profile from the Layout to prevent a duplicate DB call
  const { globalProfile, isLoadingProfile } = useOutletContext();

  const [location, setLocation] = useState(undefined);
  const [upcoming, setUpcoming] = useState(undefined);
  const [weightData, setWeightData] = useState(undefined);
  const [activity, setActivity] = useState(undefined);
  const [history, setHistory] = useState(undefined);
  const [metrics, setMetrics] = useState(undefined);

  useEffect(() => {
    const fetchDashboardData = async () => {
      
      // 1. Fetch Location
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

      // 2. THE FRONTEND FIX: Fetch from main Appointment API instead of restricted Dashboard API
      appointmentApi.getUpcoming()
        .then(res => {
          // Extract the array of appointments regardless of backend wrapper format
          const appointments = res.appointments || res.data || res || [];
          
          // Filter for active appointments (Scheduled)
          const scheduledAppts = appointments.filter(a => a.status === 'Scheduled' || a.status === 'Pending' || a.status === 'Confirmed');
          
          if (scheduledAppts.length > 0) {
            // Sort them purely on the frontend to find the nearest one in time
            scheduledAppts.sort((a, b) => {
              const dateA = new Date(`${(a.appointment_date || '').split('T')[0]}T${a.appointment_time || '00:00:00'}`);
              const dateB = new Date(`${(b.appointment_date || '').split('T')[0]}T${b.appointment_time || '00:00:00'}`);
              return dateA - dateB;
            });

            const next = scheduledAppts[0];
            
            // Format the date string safely for the card
            let scheduledAtDate = new Date();
            if (next.appointment_date && next.appointment_time) {
                scheduledAtDate = new Date(`${next.appointment_date.split('T')[0]}T${next.appointment_time}`);
            } else if (next.start_time || next.scheduled_at) {
                scheduledAtDate = new Date(next.start_time || next.scheduled_at);
            }

            // Map the data exactly how UpcomingAppointmentCard expects it
            setUpcoming({
              id: next.id || next.appointment_id,
              scheduled_at: scheduledAtDate.toISOString(),
              mode: next.consultation_type || next.mode || 'Video',
              doctorName: next.doctor_name || next.doctorName || 'Your Doctor',
              specialty: next.specialization || next.specialty || 'Ayurvedic Practitioner',
              avatar: next.doctor_avatar || next.avatar || next.profile_image_url || null
            });
          } else {
            setUpcoming(null);
          }
        })
        .catch((e) => {
          console.log("Upcoming Appointment Fetch bypassed:", e);
          setUpcoming(null);
        });

      // 3. Batch 2 - Secondary Data (Charts & Metrics)
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
      
      {/* Top Row: Profile & Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-10">
        <div className="lg:col-span-2">
          <PatientProfileSummary
            profile={globalProfile || {}}
            location={location}
            isLoading={isLoadingProfile}
          />
        </div>
        <div className="lg:col-span-1">
          <UpcomingAppointmentCard
            appointment={upcoming}
            isLoading={upcoming === undefined}
          />
        </div>
      </div>

      {/* Middle Row: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-6 lg:mb-10">
        <WeightTracker
          weightData={weightData || []}
          profileWeight={globalProfile?.weight_kg}
          isLoading={weightData === undefined || isLoadingProfile}
        />
        <WellnessActivity
          activityData={activity || []}
          isLoading={activity === undefined}
        />
      </div>

      {/* Bottom Row: Medical History & Metrics */}
      <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 pb-4 lg:pb-2">
        <MedicalHistory
          history={history || {}}
          isLoading={history === undefined}
        />
        <QuickMetrics
          metrics={metrics || []}
          isLoading={metrics === undefined}
        />
      </div>
    </div>
  );
};

export default PatientDashboard;