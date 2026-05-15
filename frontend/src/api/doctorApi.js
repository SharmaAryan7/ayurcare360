import axiosInstance from './axiosConfig';

export const doctorApi = {
    // ==========================================
    // DASHBOARD
    // ==========================================
    getTotalPatients: async () => (await axiosInstance.get('/doctors/dashboard/get-total-patients')).data,
    getAppointmentsToday: async () => (await axiosInstance.get('/doctors/dashboard/get-appointments-today')).data,
    getUpcomingConsultations: async () => (await axiosInstance.get('/doctors/dashboard/get-upcoming-consultations')).data,
    getRecentUpcomingAppointments: async () => (await axiosInstance.get('/doctors/dashboard/get-recent-upcoming-appointments')).data,
    getEarningSummary: async () => (await axiosInstance.get('/doctors/dashboard/get-earning-summary')).data,

    // ==========================================
    // APPOINTMENTS
    // ==========================================
    getAllAppointments: async () => (await axiosInstance.get('/doctors/appointments/get-all-appointments')).data,
    getTodayAppointments: async () => (await axiosInstance.get('/doctors/appointments/get-today-appointments')).data,
    getUpcomingAppointments: async () => (await axiosInstance.get('/doctors/appointments/get-upcoming-appointments')).data,
    getCompletedAppointments: async () => (await axiosInstance.get('/doctors/appointments/get-completed-appointments')).data,
    getCancelledAppointments: async () => (await axiosInstance.get('/doctors/appointments/get-cancelled-appointments')).data,

    // ==========================================
    // APPOINTMENT DETAILS
    // ==========================================
    getApptPatientInfo: async (id) => (await axiosInstance.get(`/doctors/appointments/${id}/patient-info`)).data,
    getApptSymptoms: async (id) => (await axiosInstance.get(`/doctors/appointments/${id}/symptoms`)).data,
    getApptReports: async (id) => (await axiosInstance.get(`/doctors/appointments/${id}/get-all-patient-reports`)).data,
    downloadApptReport: async (id, reportId) => (await axiosInstance.get(`/doctors/appointments/${id}/patient-reports/${reportId}/download`, { responseType: 'blob' })).data,
    getApptMedicalInfo: async (id) => (await axiosInstance.get(`/doctors/appointments/${id}/get-patient-medical-information`)).data,
    startVideoConsultation: async (id) => (await axiosInstance.post(`/doctors/appointments/${id}/start-video-consultation`)).data,
    rescheduleAppointment: async (id, data) => (await axiosInstance.put(`/doctors/appointments/${id}/reschedule-appointment`, data)).data,
    cancelAppointment: async (id) => (await axiosInstance.put(`/doctors/appointments/${id}/cancel-appointment`)).data,

    // ==========================================
    // EARNINGS
    // ==========================================
    getTotalEarnings: async () => (await axiosInstance.get('/doctors/earnings/get-total-earnings')).data,
    getMonthlyEarning: async () => (await axiosInstance.get('/doctors/earnings/get-monthly-earning')).data,
    getEarningHistory: async () => (await axiosInstance.get('/doctors/earnings/get-earning-history')).data,

    // ==========================================
    // PROFILE
    // ==========================================
    getProfilePersonalInfo: async () => (await axiosInstance.get('/doctors/profile/get-personal-information')).data,
    getNextConsultation: async () => (await axiosInstance.get('/doctors/profile/get-next-consultation')).data,
    getContactInfo: async () => (await axiosInstance.get('/doctors/profile/get-contact-info')).data,
    getCredentials: async () => (await axiosInstance.get('/doctors/profile/get-credentials')).data,
    getPhilosophy: async () => (await axiosInstance.get('/doctors/profile/get-philosophy')).data,

    // ==========================================
    // SETTINGS
    // ==========================================
    getSettingsPersonalInfo: async () => (await axiosInstance.get('/doctors/settings/get-personal-information')).data,
    updateSettingsPersonalInfo: async (data) => (await axiosInstance.put('/doctors/settings/update-personal-information', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    getPreferences: async () => (await axiosInstance.get('/doctors/settings/get-preferences')).data,
    updatePreferences: async (data) => (await axiosInstance.put('/doctors/settings/update-preferences', data)).data,
    getProfessionalCredentials: async () => (await axiosInstance.get('/doctors/settings/get-professional-credentials')).data,
    updateProfessionalCredentials: async (data) => (await axiosInstance.put('/doctors/settings/update-professional-credentials', data)).data,
    getConsultationLogistics: async () => (await axiosInstance.get('/doctors/settings/get-consultation-logistics')).data,
    updateConsultationLogistics: async (data) => (await axiosInstance.put('/doctors/settings/update-consultation-logistic', data)).data,
    getPhilosophyOfCare: async () => (await axiosInstance.get('/doctors/settings/get-philosophy-of-care')).data,
    updatePhilosophyOfCare: async (data) => (await axiosInstance.put('/doctors/settings/update-philosophy-of-care', data)).data,
    updateAccountPassword: async (data) => (await axiosInstance.put('/doctors/settings/update-account-password', data)).data,
};