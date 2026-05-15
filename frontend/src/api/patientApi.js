import axiosInstance from './axiosConfig';

export const patientApi = {
    // --- DASHBOARD ---
    getDashPatientDetails: async () => (await axiosInstance.get('/patient/dashboard/patient-details')).data,
    getDashUpcomingSession: async () => (await axiosInstance.get('/patient/dashboard/upcoming-session-appointments')).data,
    getDashWeightTracker: async () => (await axiosInstance.get('/patient/dashboard/body-weight-tracker')).data,
    getDashWellnessActivity: async () => (await axiosInstance.get('/patient/dashboard/weekly-wellness-activity')).data,
    getDashMedicalHistory: async () => (await axiosInstance.get('/patient/dashboard/medical-history')).data,
    getDashQuickMetrics: async () => (await axiosInstance.get('/patient/dashboard/next-meditation-hydration-goal-sleep-quality')).data,

    // --- PROFILE ---
    getProfilePersonal: async () => (await axiosInstance.get('/patient/profile/personal-information')).data,
    updateProfilePersonal: async (data) => (await axiosInstance.put('/patient/profile/personal-information/update', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    downloadProfilePersonal: async () => (await axiosInstance.get('/patient/profile/personal-information/download', { responseType: 'blob' })).data,
    getProfileMedical: async () => (await axiosInstance.get('/patient/profile/medical-information')).data,
    getProfileContact: async () => (await axiosInstance.get('/patient/profile/contact-information')).data,
    updateProfileContact: async (data) => (await axiosInstance.put('/patient/profile/contact-information/update', data)).data,
    getProfileEmergency: async () => (await axiosInstance.get('/patient/profile/emergency-contact')).data,
    updateProfileEmergency: async (data) => (await axiosInstance.put('/patient/profile/emergency-contact/update', data)).data,
    getProfileMedical: async () => (await axiosInstance.get('/patient/profile/medical-information')).data,
    updateProfileMedical: async (data) => (await axiosInstance.put('/patient/profile/medical-information/update', data)).data, // <-- ADD THIS

    // --- SETTINGS ---
    getSettingsAccount: async () => (await axiosInstance.get('/patient/settings/account-details')).data,
    updateSettingsAccount: async (data) => (await axiosInstance.put('/patient/settings/account-details/update', data)).data,
    changePassword: async (data) => (await axiosInstance.put('/patient/settings/change-password', data)).data,
    getSettingsNotifications: async () => (await axiosInstance.get('/patient/settings/notifications')).data,
    getSettingsPrivacy: async () => (await axiosInstance.get('/patient/settings/privacy-&-settings')).data,
    updateSettingsData: async (data) => (await axiosInstance.put('/patient/settings/update-setting-data', data)).data,

    // --- HEALTH REPORTS ---
    uploadReport: async (formData) => (await axiosInstance.post('/patient/health-records/upload-new-report', formData, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    getRecentReports: async () => (await axiosInstance.get('/patient/health-records/recent-reports')).data,
    downloadReport: async (id) => (await axiosInstance.get(`/patient/health-reports/${id}/download`, { responseType: 'blob' })).data,
    filterReports: async (reportName, doctorName, date) => (await axiosInstance.get(`/patient/health-reports/filters/report-name=${reportName}-doctor-name=${doctorName}-date=${date}`)).data,
    getReportInsights: async () => (await axiosInstance.get('/patient/health-reports/quick-insights')).data,
    getReportVitality: async () => (await axiosInstance.get('/patient/health-reports/vitality-spark')).data,
    getReportGoals: async () => (await axiosInstance.get('/patient/health-reports/wellness-goals')).data,
    getReportLastChanged: async () => (await axiosInstance.get('/patient/health-reports/last-changed')).data,
};