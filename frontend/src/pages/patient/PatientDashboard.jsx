import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom'; // 🔥 IMPORT ADDED
import { patientApi } from '../../api/patientApi';
import PatientProfileSummary from '../../components/patient/dashboard/PatientProfileSummary';
import UpcomingAppointmentCard from '../../components/patient/dashboard/UpcomingAppointmentCard';
import WeightTracker from '../../components/patient/dashboard/WeightTracker';
import WellnessActivity from '../../components/patient/dashboard/WellnessActivity';
import MedicalHistory from '../../components/patient/dashboard/MedicalHistory';
import QuickMetrics from '../../components/patient/dashboard/QuickMetrics';

const PatientDashboard = () => {
  // Grab the profile from the Layout to prevent a duplicate DB call!
  const { globalProfile, isLoadingProfile } = useOutletContext();

  const [location, setLocation] = useState(undefined);
  const [upcoming, setUpcoming] = useState(undefined);
  const [weightData, setWeightData] = useState(undefined);
  const [activity, setActivity] = useState(undefined);
  const [history, setHistory] = useState(undefined);
  const [metrics, setMetrics] = useState(undefined);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Batch 1 - Critical Data 
      await Promise.all([
        patientApi.getProfileContact()
          .then(data => {
            if (data && data.address) {
              const parts = data.address.split(',');
              setLocation(parts.length > 1 ? parts[1].trim() : data.address);
            } else {
              setLocation(null);
            }
          })
          .catch(err => { console.error(err); setLocation(null); }),

        patientApi.getDashUpcomingSession()
          .then(data => setUpcoming(data || null))
          .catch(err => { console.error(err); setUpcoming(null); })
      ]);

      // Batch 2 - Secondary Data (Charts & Metrics)
      await Promise.all([
        patientApi.getDashWeightTracker()
          .then(data => setWeightData(data || []))
          .catch(err => { console.error(err); setWeightData([]); }),

        patientApi.getDashWellnessActivity()
          .then(data => setActivity(data || []))
          .catch(err => { console.error(err); setActivity([]); }),

        patientApi.getDashMedicalHistory()
          .then(data => setHistory(data || {}))
          .catch(err => { console.error(err); setHistory({}); }),

        patientApi.getDashQuickMetrics()
          .then(data => setMetrics(data || []))
          .catch(err => { console.error(err); setMetrics([]); })
      ]);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto p-10 bg-[#FDF9EE] min-h-full">
      {/* Top Row: Profile & Appointment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          {/* Using globalProfile and isLoadingProfile from Outlet context */}
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
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
      <div className="flex flex-col gap-8 pb-2">
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