import React, { useState, useEffect } from 'react';
import { appointmentApi } from '../../api/appointmentApi';
import PrescriptionList from '../../components/patient/prescriptions/PrescriptionList';
import AutomatedRefillsCard from '../../components/patient/prescriptions/AutomatedRefillsCard';
import ExpertConsultationCard from '../../components/patient/prescriptions/ExpertConsultationCard';

const PatientPrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [refillData, setRefillData] = useState(null);
  const [consultationData, setConsultationData] = useState(null);

  useEffect(() => {
    appointmentApi.getAllPrescriptions().then(setPrescriptions).catch(console.error);
    appointmentApi.getAutomatedRefills().then(setRefillData).catch(console.error);
    appointmentApi.getExpertConsultation().then(setConsultationData).catch(console.error);
  }, []);

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto flex flex-col">
      <div className="mb-10">
        <p className="text-[12px] font-bold text-green-700 uppercase tracking-widest mb-2">Wellness Records</p>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Prescriptions</h1>
      </div>

      <div className="flex-1 bg-white rounded-[32px] p-8 md:p-10 border border-[#EFEBE1] shadow-sm flex flex-col">
        <div className="flex-1 mb-10">
          <PrescriptionList prescriptions={prescriptions} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="md:col-span-2">
            <AutomatedRefillsCard data={refillData} />
          </div>
          <div className="md:col-span-1">
            <ExpertConsultationCard data={consultationData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientPrescriptionsPage;