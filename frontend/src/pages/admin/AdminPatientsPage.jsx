import React, { useState, useEffect } from 'react';
import { adminApi } from '../../api/adminApi';
import PatientsTable from '../../components/admin/patients/PatientsTable';
import PatientMetricsRow from '../../components/admin/patients/PatientMetricsRow';
import { Loader2 } from 'lucide-react';

const AdminPatientsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    patients: [],
    metrics: { newThisWeek: 0, pendingReviews: 0, averageAge: 0 }
  });

  useEffect(() => {
    const fetchPatientsData = async () => {
      try {
        const [patRes, newRes, revRes, ageRes] = await Promise.all([
          adminApi.getAllPatients(),
          adminApi.getNewPatientsThisWeek(),
          adminApi.getPendingPatientReviews(),
          adminApi.getAveragePatientAge()
        ]);

        setData({
          patients: patRes.patients || [],
          metrics: {
            newThisWeek: newRes.count || 0,
            pendingReviews: revRes.count || 0,
            averageAge: ageRes.age || 0
          }
        });
      } catch (error) {
        console.error("Failed to load patients data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatientsData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto flex flex-col h-full animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Patients
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Manage and review patient records for your facility.
        </p>
      </div>

      <div className="flex-1">
        <PatientsTable patients={data.patients} />
      </div>

      <PatientMetricsRow metrics={data.metrics} total={data.patients.length} />
    </div>
  );
};

export default AdminPatientsPage;