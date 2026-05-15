import axiosInstance from './axiosConfig';

export const adminApi = {
    // DASHBOARD
    getTotalDoctors: async () => (await axiosInstance.get('/admin/dashboard/total-doctors')).data,
    getTotalPatients: async () => (await axiosInstance.get('/admin/dashboard/total-patients')).data,
    getTotalOrders: async () => (await axiosInstance.get('/admin/dashboard/total-orders')).data,
    getTotalRevenue: async () => (await axiosInstance.get('/admin/dashboard/total-revenue')).data,
    getRecentDoctors: async () => (await axiosInstance.get('/admin/dashboard/get-recent-doctors')).data,
    getRecentPatients: async () => (await axiosInstance.get('/admin/dashboard/get-recent-patients')).data,
    getRecentOrders: async () => (await axiosInstance.get('/admin/dashboard/get-recent-orders')).data,

    // DOCTORS 
    getAllDoctors: async () => (await axiosInstance.get('/admin/doctors/get-all-doctors')).data,
    addDoctor: async (data) => (await axiosInstance.post('/admin/doctors/add-doctor', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    deleteDoctor: async (id) => (await axiosInstance.delete(`/admin/doctors/delete-doctor/${id}`)).data,
    getVerificationRate: async () => (await axiosInstance.get('/admin/doctors/verification-rate')).data,
    getAverageResponseTime: async () => (await axiosInstance.get('/admin/doctors/average-response-time')).data,
    getPendingApprovals: async () => (await axiosInstance.get('/admin/doctors/pending-approvals')).data,
    updateDoctorDetails: async (id, data) => (await axiosInstance.put(`/admin/doctors/${id}/update-doctor-details`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    getDoctorDetails: async (id) => (await axiosInstance.get(`/admin/doctors/${id}/get-doctor-details`)).data,

    // PATIENTS
    getAllPatients: async () => (await axiosInstance.get('/admin/patients/get-all-patients')).data,
    getNewPatientsThisWeek: async () => (await axiosInstance.get('/admin/patients/new-this-week')).data,
    getPendingPatientReviews: async () => (await axiosInstance.get('/admin/patients/pending-reviews')).data,
    getAveragePatientAge: async () => (await axiosInstance.get('/admin/patients/average-age')).data,

    // PATIENT DETAILS
    getPatientPersonalInfo: async (id) => (await axiosInstance.get(`/admin/patient-details/${id}/get-personal-information`)).data,
    getPatientMedicalInfo: async (id) => (await axiosInstance.get(`/admin/patient-details/${id}/get-medical-info`)).data,
    getPatientAppointmentHistory: async (id) => (await axiosInstance.get(`/admin/patient-details/${id}/get-appointment-history`)).data,
    getPatientPharmacyOrders: async (id) => (await axiosInstance.get(`/admin/patient-details/${id}/get-pharmacy-orders`)).data,

    // ORDERS
    getOrdersByPagination: async (page) => (await axiosInstance.get(`/admin/orders/get-orders-by-pagination/${page}`)).data,
    getTodaysRevenue: async () => (await axiosInstance.get('/admin/orders/todays-revenue')).data,
    getPendingOrderTasks: async () => (await axiosInstance.get('/admin/orders/pending-tasks')).data,
    getOrderGrowthRate: async () => (await axiosInstance.get('/admin/orders/growth-rate')).data,

    // ORDER DETAILS
    printInvoice: async (id) => (await axiosInstance.get(`/admin/order-details/${id}/print-invoice`, { responseType: 'blob' })).data,
    getOrderBasicDetails: async (id) => (await axiosInstance.get(`/admin/order-details/${id}/basic-details`)).data,
    getOrderItems: async (id) => (await axiosInstance.get(`/admin/order-details/${id}/items-ordered`)).data,
    getOrderCustomerDetails: async (id) => (await axiosInstance.get(`/admin/order-details/${id}/customer-details`)).data,
    getOrderTimeline: async (id) => (await axiosInstance.get(`/admin/order-details/${id}/order-timeline`)).data,
    getOrderPaymentSummary: async (id) => (await axiosInstance.get(`/admin/order-details/${id}/payment-summary`)).data,

    // INVENTORY 
    addNewProduct: async (data) => (await axiosInstance.post('/admin/inventory/add-new-product', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    getAllProductsPagination: async (page) => (await axiosInstance.get(`/admin/inventory/get-all-product-by-pagination/${page}`)).data,
    filterInventory: async (filters) => (await axiosInstance.post('/admin/inventory/filter', filters)).data,
    getAllCategories: async () => (await axiosInstance.get('/admin/inventory/all-category')).data,
    getProductDetails: async (id) => (await axiosInstance.get(`/admin/inventory/${id}/get-product-details`)).data,
    updateProduct: async (id, data) => (await axiosInstance.put(`/admin/inventory/${id}/update-product`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    deleteProduct: async (id) => (await axiosInstance.delete(`/admin/inventory/${id}/delete-product`)).data,

    // BLOGS
    getAllBlogs: async () => (await axiosInstance.get('/admin/blogs/get-all-blogs')).data,
    addNewBlog: async (data) => (await axiosInstance.post('/admin/blogs/add-new-blog', data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    updateBlog: async (id, data) => (await axiosInstance.put(`/admin/blogs/${id}/update-blog`, data, { headers: { 'Content-Type': 'multipart/form-data' } })).data,
    deleteBlog: async (id) => (await axiosInstance.delete(`/admin/blogs/delete-blog/${id}`)).data,
    getTrendingCategory: async () => (await axiosInstance.get('/admin/blogs/trending-category')).data,
    getBlogsReviewRequired: async () => (await axiosInstance.get('/admin/blogs/review-required')).data,
    getBlogTraffic: async () => (await axiosInstance.get('/admin/blogs/blog-traffic')).data,
    saveBlogAsDraft: async (id, data) => (await axiosInstance.put(`/admin/blogs/${id}/save-as-draft`, data)).data,
    getBlogDetails: async (id) => (await axiosInstance.get(`/admin/blogs/${id}/get-blog-details`)).data,

    // REPORTS
    exportReportsPdf: async () => (await axiosInstance.get('/admin/reports/export-pdf', { responseType: 'blob' })).data,
    getOverallReportDetails: async () => (await axiosInstance.get('/admin/reports/get-overall-details')).data,
    getLast30DaysDetails: async () => (await axiosInstance.get('/admin/reports/get-last-30-days-details')).data,
    getOrderTrend: async () => (await axiosInstance.get('/admin/reports/get-order-trend')).data,
    getRevenueGrowth: async () => (await axiosInstance.get('/admin/reports/get-revenue-growth')).data,
    getRevenueStreamAnalysis: async () => (await axiosInstance.get('/admin/reports/get-revenue-stream-analysis')).data,
    getTopPerformingProducts: async () => (await axiosInstance.get('/admin/reports/get-top-performing-products')).data,
    getTopConsultations: async () => (await axiosInstance.get('/admin/reports/top-consultations')).data,

    // SETTINGS
    getSettingsTotalRevenue: async () => (await axiosInstance.get('/admin/settings/get-total-revenue')).data,
    getSecurityScore: async () => (await axiosInstance.get('/admin/settings/get-security-score')).data,
    getActiveSessions: async () => (await axiosInstance.get('/admin/settings/get-active-sessions')).data,
    addAdmin: async (data) => (await axiosInstance.post('/admin/settings/add-admin', data)).data,
    updateAdminDetails: async (id, data) => (await axiosInstance.put(`/admin/settings/${id}/update-admin-details`, data)).data,
    getAllAdmins: async () => (await axiosInstance.get('/admin/settings/get-all-admins')).data,
    getAdminDetails: async (id) => (await axiosInstance.get(`/admin/settings/${id}/get-admin-details`)).data,
};