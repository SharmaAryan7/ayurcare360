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

      // 2. Fetch Appointments & Apply the 35-minute Frontend Auto-Complete logic!
      appointmentApi.getUpcoming()
        .then(res => {
          const appointments = res.appointments || res.data || res || [];
          const now = new Date();
          
          // Filter out cancelled/completed AND anything past the 35-minute mark
          const trulyUpcomingAppts = appointments.filter(apt => {
            const currentStatus = apt.status || apt.appointment_status;
            
            // Step 1: Must be active
            if (currentStatus !== 'Scheduled' && currentStatus !== 'Pending' && currentStatus !== 'Confirmed') {
                return false;
            }

            // Step 2: Parse date safely
            let aptDate = null;
            if (apt.start_time || apt.scheduled_at) {
                aptDate = new Date(apt.start_time || apt.scheduled_at);
            } else {
                const dateStr = apt.appointment_date || apt.date;
                const timeStr = apt.appointment_time || apt.time;
                if (dateStr && timeStr) {
                    const cleanDate = dateStr.includes('T') ? dateStr.split('T')[0] : dateStr;
                    aptDate = new Date(`${cleanDate}T${timeStr.trim()}`);
                } else if (dateStr) {
                    aptDate = new Date(dateStr);
                }
            }

            // Step 3: Check against the 35-minute buffer
            if (aptDate && !isNaN(aptDate.getTime())) {
                const completionTime = new Date(aptDate.getTime() + (35 * 60 * 1000));
                // If now is GREATER than completion time, this appointment is "Completed" -> Filter it OUT
                if (now > completionTime) {
                    return false;
                }
            }
            
            return true; // Keep it if it hasn't expired yet!
          });
          
          if (trulyUpcomingAppts.length > 0) {
            // Sort to find the NEXT nearest appointment
            trulyUpcomingAppts.sort((a, b) => {
              const dateA = new Date(`${(a.appointment_date || a.date || '').split('T')[0]}T${a.appointment_time || a.time || '00:00:00'}`);
              const dateB = new Date(`${(b.appointment_date || b.date || '').split('T')[0]}T${b.appointment_time || b.time || '00:00:00'}`);
              return dateA - dateB;
            });

            const next = trulyUpcomingAppts[0];
            
            // Format for the UI Card
            let scheduledAtDate = new Date();
            if (next.appointment_date && next.appointment_time) {
                const cleanDate = next.appointment_date.includes('T') ? next.appointment_date.split('T')[0] : next.appointment_date;
                scheduledAtDate = new Date(`${cleanDate}T${next.appointment_time.trim()}`);
            } else if (next.start_time || next.scheduled_at) {
                scheduledAtDate = new Date(next.start_time || next.scheduled_at);
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