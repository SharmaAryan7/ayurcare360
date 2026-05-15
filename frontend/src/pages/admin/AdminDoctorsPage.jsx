import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';
import DoctorsTable from '../../components/admin/doctors/DoctorsTable';
import DoctorMetricsRow from '../../components/admin/doctors/DoctorMetricsRow';

const AdminDoctorsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    metrics: { total: 0, pending: 0, verificationRate: "0%", avgResponseTime: "0" },
    doctors: []
  });

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch all data concurrently
        const [totalRes, pendingRes, rateRes, respRes, doctorsListRes] = await Promise.all([
          adminApi.getTotalDoctors(),
          adminApi.getPendingApprovals(),
          adminApi.getVerificationRate(),
          adminApi.getAverageResponseTime(),
          adminApi.getAllDoctors()
        ]);

        setData({
          metrics: {
            total: totalRes.count || 0,
            pending: pendingRes.count || 0,
            verificationRate: rateRes.rate || "0%",
            avgResponseTime: respRes.time || "0"
          },
          doctors: doctorsListRes.doctors || []
        });
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();
  }, []);

  // Instantly updates UI upon successful deletion
const handleDeleteDoctor = async (doctorId) => {
    console.log("STEP 1: Function triggered for Doctor ID:", doctorId); 

    try {
      console.log("STEP 2: Attempting to call adminApi.deleteDoctor..."); 
      
      const res = await adminApi.deleteDoctor(doctorId);
      
      console.log("STEP 3: Backend responded with:", res); 
      
      if (res.success) {
        setData(prevData => ({
          ...prevData,
          doctors: prevData.doctors.filter(doc => doc.id !== doctorId),
          metrics: { 
            ...prevData.metrics, 
            total: Math.max(0, prevData.metrics.total - 1) 
          }
        }));
        console.log("STEP 4: UI Successfully Updated!"); 
      }
    } catch (error) {
      console.error("FAILED AT STEP 3: Backend threw an error:", error);
      alert(error.response?.data?.message || "Failed to delete doctor.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-[#4A7C59] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto flex flex-col h-full">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
          Doctors
        </h1>
        <p className="text-sm font-medium text-gray-500">
          Manage your medical practitioners and their clinical records.
        </p>
      </div>

      {/* Main Table Area */}
      <div className="flex-1">
        <DoctorsTable doctors={data.doctors} onDelete={handleDeleteDoctor} />
      </div>

      {/* Bottom Metrics Cards */}
      <DoctorMetricsRow metrics={data.metrics} />

    </div>
  );
};

export default AdminDoctorsPage;