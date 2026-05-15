import axiosInstance from './axiosConfig';

export const appointmentApi = {
    // --- APPOINTMENT LISTS ---
    // --- UPDATE THIS LINE ---
    getAll: async (page = 1, limit = 10) => {
        const response = await axiosInstance.get(`/appointment/all-appointment?page=${page}&limit=${limit}`);
        return response.data;
    },
    getUpcoming: async () => (await axiosInstance.get('/appointment/upcoming-appointment')).data,
    getCompleted: async () => (await axiosInstance.get('/appointment/completed-appointment')).data,
    getCancelled: async () => (await axiosInstance.get('/appointment/cancelled-appointment')).data,
    getThisMonth: async () => (await axiosInstance.get('/appointment/this-month')).data,
    filterByDoctor: async (docName) => (await axiosInstance.get(`/appointment/filter/doctor-name=${docName}`)).data,
    getAyurvedicInsight: async () => (await axiosInstance.get('/appointment/ayurvedic-insight')).data,
    getPrepInstructions: async () => (await axiosInstance.get('/appointment/prepare-for-your-next-visit')).data,

    // --- APPOINTMENT DETAILS (:id) ---
    getActions: async (id) => (await axiosInstance.get(`/appointment/${id}/actions`)).data,
    getSymptoms: async (id) => (await axiosInstance.get(`/appointment/${id}/your-symptoms-and-notes`)).data,
    getPractitionerInfo: async (id) => (await axiosInstance.get(`/appointment/${id}/practitioner-info`)).data,
    getDocuments: async (id) => (await axiosInstance.get(`/appointment/${id}/related-documents`)).data,
    downloadDocument: async (id) => (await axiosInstance.get(`/appointment/${id}/related-documents/download`, { responseType: 'blob' })).data,
    cancelAppointment: async (id) => (await axiosInstance.put(`/appointment/${id}/cancel`)).data,

    // --- BOOK APPOINTMENT ---
    createAppointment: async (data) => (await axiosInstance.post('/book-appointment/create', data)).data, // <-- ADD THIS LINE
    getAllPractitioners: async () => (await axiosInstance.get('/book-appointment/view-all-practitioners')).data,
    filterPractitioners: async (filters) => (await axiosInstance.get('/book-appointment/view-all-practitioners/filter', { params: filters })).data,
    searchPractitioners: async (docName) => (await axiosInstance.get(`/book-appointment/view-all-practitioners/search=${docName}`)).data,
    selectPractitioner: async (docId) => (await axiosInstance.get(`/book-appointment/view-all-practitioners/select/${docId}`)).data,
    getAvailableSlots: async (docId, date) => (await axiosInstance.get(`/book-appointment/view-all-practitioners/select/${docId}/available-slots`, { params: { date } })).data,
    getBookingSummary: async (docId) => (await axiosInstance.get(`/book-appointment/view-all-practitioners/select/${docId}/appointment-summary`)).data,
    getPrakritiAnalysis: async () => (await axiosInstance.get('/book-appointment/prakriti-analysis')).data,

    // --- PRESCRIPTIONS ---
    getAllPrescriptions: async () => (await axiosInstance.get('/prescription/all-prescriptions')).data,
    downloadPrescriptionPdf: async (id) => (await axiosInstance.get(`/prescription/all-prescription/${id}/view-pdf`, { responseType: 'blob' })).data,
    getAutomatedRefills: async () => (await axiosInstance.get('/prescription/automated-refills')).data,
    getExpertConsultation: async () => (await axiosInstance.get('/prescription/expert-consultation')).data,
};