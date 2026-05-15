import React, { useState, useEffect } from 'react';
import { patientApi } from '../../api/patientApi';
import UploadReportCard from '../../components/patient/health-reports/UploadReportCard';
import QuickInsightsCard from '../../components/patient/health-reports/QuickInsightsCard';
import RecentReportsList from '../../components/patient/health-reports/RecentReportsList';
import VitalityMetricsRow from '../../components/patient/health-reports/VitalityMetricsRow';

const PatientHealthReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [insights, setInsights] = useState(null);
  const [vitality, setVitality] = useState(null);

  useEffect(() => {
    patientApi.getRecentReports().then(setReports).catch(console.error);
    patientApi.getReportInsights().then(setInsights).catch(console.error);
    patientApi.getReportVitality().then(setVitality).catch(console.error);
  }, []);

  const handleAddReport = async (fileData) => {
    try {
      const response = await patientApi.uploadReport(fileData);
      if (response.document) setReports([response.document, ...reports]);
    } catch (err) {
      alert("Failed to upload document.");
    }
  };

  return (
    <div className="bg-[#FDF9EE] min-h-full p-8 md:p-10 font-sans max-w-[1600px] mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Health Reports</h1>
        <p className="text-amber-800 font-medium text-base">Your digital archive of vitality.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 flex flex-col gap-6">
          <UploadReportCard onUpload={handleAddReport} />
          <QuickInsightsCard insights={insights} />
        </div>
        <div className="lg:col-span-2">
          <RecentReportsList reportsData={reports} />
        </div>
        <div className="lg:col-span-3 mt-2">
          <VitalityMetricsRow metrics={vitality} />
        </div>
      </div>
    </div>
  );
};

export default PatientHealthReportsPage;