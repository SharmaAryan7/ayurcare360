import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Loader2 } from 'lucide-react';
import { adminApi } from '../../api/adminApi';

import PatientProfileCard from '../../components/admin/patients/patient-details/PatientProfileCard';
import PatientMedicalInfoCard from '../../components/admin/patients/patient-details/PatientMedicalInfoCard';
import AppointmentHistoryTable from '../../components/admin/patients/patient-details/AppointmentHistoryTable';
import OrderHistoryTable from '../../components/admin/patients/patient-details/OrderHistoryTable';

const AdminPatientDetailsPage = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState({
    personal: null, medical: null, appointments: [], orders: []
  });

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const [personalRes, medicalRes, apptRes, orderRes] = await Promise.all([
          adminApi.getPatientPersonalInfo(id),
          adminApi.getPatientMedicalInfo(id),
          adminApi.getPatientAppointmentHistory(id),
          adminApi.getPatientPharmacyOrders(id)
        ]);

        setPatientData({
          personal: personalRes.success ? personalRes : null,
          medical: medicalRes.success ? medicalRes : null,
          appointments: apptRes.history || [],
          orders: orderRes.orders || []
        });
      } catch (error) {
        console.error("Failed to load patient details", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatientDetails();
  }, [id]);

  if (isLoading || !patientData.personal) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh]">
        <Loader2 className="w-12 h-12 text-[#3A6447] animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 md:p-10 max-w-[1600px] mx-auto animate-in fade-in duration-300">
      <div className="mb-10">
        <div className="flex items-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-3">
          <Link to="/admin/patients" className="hover:text-[#4A7C59] transition-colors">Patients</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-gray-900">Patient Details</span>
        </div>
        <div className="flex justify-between items-end">
          <h1 className="text-3xl md:text-[32px] font-extrabold text-gray-900 tracking-tight leading-none mb-2">
            Patient Details
          </h1>
          <span className="bg-[#EAE5D9] text-[#79563E] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
            Registry ID: {patientData.personal.patient_display_id || id}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <PatientProfileCard patient={patientData.personal} />
        </div>
        <div className="lg:col-span-1">
          <PatientMedicalInfoCard medicalInfo={patientData.medical} />
        </div>
      </div>

      <AppointmentHistoryTable appointments={patientData.appointments} />
      <OrderHistoryTable orders={patientData.orders} />
    </div>
  );
};

export default AdminPatientDetailsPage;