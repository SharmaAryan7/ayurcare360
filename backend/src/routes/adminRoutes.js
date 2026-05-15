const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

// Ensure all routes require admin role
router.use(requireAuth);
router.use(requireRole('admin'));

// DASHBOARD
router.get('/dashboard/total-doctors', adminController.getTotalDoctors);
router.get('/dashboard/total-patients', adminController.getTotalPatients);
router.get('/dashboard/total-orders', adminController.getTotalOrders);
router.get('/dashboard/total-revenue', adminController.getTotalRevenue);
router.get('/dashboard/get-recent-doctors', adminController.getRecentDoctors);
router.get('/dashboard/get-recent-patients', adminController.getRecentPatients);
router.get('/dashboard/get-recent-orders', adminController.getRecentOrders);

// DOCTORS
router.get('/doctors/get-all-doctors', adminController.getAllDoctors);
router.post('/doctors/add-doctor', upload.single('avatar'), uploadToS3, adminController.addDoctor);
router.post('/add-doctor/submit-details', upload.single('avatar'), uploadToS3, adminController.addDoctor);
router.delete('/doctors/delete-doctor/:id', adminController.deleteDoctor);
router.get('/doctors/verification-rate', adminController.getVerificationRate);
router.get('/doctors/average-response-time', adminController.getAverageResponseTime);
router.get('/doctors/pending-approvals', adminController.getPendingApprovals);
router.put('/doctors/:id/update-doctor-details', upload.single('avatar'), uploadToS3, adminController.updateDoctorDetails);
router.get('/doctors/:id/get-doctor-details', adminController.getDoctorDetails);

// PATIENTS
router.get('/patients/get-all-patients', adminController.getAllPatients);
router.get('/patients/new-this-week', adminController.getNewPatientsThisWeek);
router.get('/patients/pending-reviews', adminController.getPendingPatientReviews);
router.get('/patients/average-age', adminController.getAveragePatientAge);

// PATIENT DETAILS
router.get('/patient-details/:id/get-personal-information', adminController.getPatientPersonalInfo);
router.get('/patient-details/:id/get-medical-info', adminController.getPatientMedicalInfo);
router.get('/patient-details/:id/get-appointment-history', adminController.getPatientAppointmentHistory);
router.get('/patient-details/:id/get-pharmacy-orders', adminController.getPatientPharmacyOrders);

// ORDERS
router.get('/orders/get-orders-by-pagination/:page', adminController.getOrdersByPagination);
router.get('/orders/todays-revenue', adminController.getTodaysRevenue);
router.get('/orders/pending-tasks', adminController.getPendingOrderTasks);
router.get('/orders/growth-rate', adminController.getOrderGrowthRate);

// ORDER DETAILS
router.get('/order-details/:id/print-invoice', adminController.printInvoice);
router.get('/order-details/:id/basic-details', adminController.getOrderBasicDetails);
router.get('/order-details/:id/items-ordered', adminController.getOrderItems);
router.get('/order-details/:id/customer-details', adminController.getOrderCustomerDetails);
router.get('/order-details/:id/order-timeline', adminController.getOrderTimeline);
router.get('/order-details/:id/payment-summary', adminController.getOrderPaymentSummary);

// INVENTORY
router.post('/inventory/add-new-product', upload.single('image'), uploadToS3, adminController.addNewProduct);
router.get('/inventory/get-all-product-by-pagination/:page', adminController.getAllProductsPagination);
router.post('/inventory/filter', adminController.filterInventory);
router.get('/inventory/all-category', adminController.getAllCategories);
router.get('/inventory/:id/get-product-details', adminController.getProductDetails);
router.put('/inventory/:id/update-product', upload.single('image'), uploadToS3, adminController.updateProduct);
router.delete('/inventory/:id/delete-product', adminController.deleteProduct);

// BLOGS
router.get('/blogs/get-all-blogs', adminController.getAllBlogs);
router.post('/blogs/add-new-blog', upload.single('image'), uploadToS3, adminController.addNewBlog);
router.put('/blogs/:id/update-blog', upload.single('image'), uploadToS3, adminController.updateBlog);
router.delete('/blogs/delete-blog/:id', adminController.deleteBlog);
router.get('/blogs/trending-category', adminController.getTrendingCategory);
router.get('/blogs/review-required', adminController.getBlogsReviewRequired);
router.get('/blogs/blog-traffic', adminController.getBlogTraffic);
router.put('/blogs/:id/save-as-draft', adminController.saveBlogAsDraft);
router.get('/blogs/:id/get-blog-details', adminController.getBlogDetails);

// REPORTS
router.get('/reports/export-pdf', adminController.exportReportsPdf);
router.get('/reports/get-overall-details', adminController.getOverallReportDetails);
router.get('/reports/get-last-30-days-details', adminController.getLast30DaysDetails);
router.get('/reports/get-order-trend', adminController.getOrderTrend);
router.get('/reports/get-revenue-growth', adminController.getRevenueGrowth);
router.get('/reports/get-revenue-stream-analysis', adminController.getRevenueStreamAnalysis);
router.get('/reports/get-top-performing-products', adminController.getTopPerformingProducts);
router.get('/reports/top-consultations', adminController.getTopConsultations);

// SETTINGS
router.get('/settings/get-total-revenue', adminController.getSettingsTotalRevenue);
router.get('/settings/get-security-score', adminController.getSecurityScore);
router.get('/settings/get-active-sessions', adminController.getActiveSessions);
router.post('/settings/add-admin', adminController.addAdmin);
router.put('/settings/:id/update-admin-details', adminController.updateAdminDetails);
router.get('/settings/get-all-admins', adminController.getAllAdmins);
router.get('/settings/:id/get-admin-details', adminController.getAdminDetails);

module.exports = router;