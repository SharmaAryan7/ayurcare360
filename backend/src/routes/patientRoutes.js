const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/patientController');
const { requireAuth } = require('../middlewares/authMiddleware');
// Change this:
// const upload = require('../middlewares/uploadMiddleware');

// To this:
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
// Ensure all patient routes require a valid session/token
router.use(requireAuth);

// ==========================================
// 1. DASHBOARD
// ==========================================
router.get('/dashboard/patient-details', ctrl.getDashPatientDetails);
router.get('/dashboard/upcoming-session-appointments', ctrl.getDashUpcomingSession);
router.get('/dashboard/body-weight-tracker', ctrl.getDashWeightTracker);
router.get('/dashboard/weekly-wellness-activity', ctrl.getDashWellnessActivity);
router.get('/dashboard/medical-history', ctrl.getDashMedicalHistory);
router.get('/dashboard/next-meditation-hydration-goal-sleep-quality', ctrl.getDashQuickMetrics);

// ==========================================
// 2. PROFILE
// ==========================================
router.get('/profile/medical-information', ctrl.getProfileMedical);
router.put('/profile/medical-information/update', ctrl.updateProfileMedical); // <-- ADD THIS
router.get('/profile/personal-information', ctrl.getProfilePersonal);
router.put('/profile/personal-information/update', upload.single('avatar'), uploadToS3, ctrl.updateProfilePersonal);
router.get('/profile/personal-information/download', ctrl.downloadProfilePersonal);

router.get('/profile/medical-information', ctrl.getProfileMedical);

router.get('/profile/contact-information', ctrl.getProfileContact);
router.put('/profile/contact-information/update', ctrl.updateProfileContact);

router.get('/profile/emergency-contact', ctrl.getProfileEmergency);
router.put('/profile/emergency-contact/update', ctrl.updateProfileEmergency);

// ==========================================
// 3. SETTINGS
// ==========================================
router.get('/settings/account-details', ctrl.getSettingsAccount);
router.put('/settings/account-details/update', ctrl.updateSettingsAccount);

router.put('/settings/change-password', ctrl.changePassword);

router.get('/settings/notifications', ctrl.getSettingsNotifications);
router.get('/settings/privacy-&-settings', ctrl.getSettingsPrivacy);
router.put('/settings/update-setting-data', ctrl.updateSettingsData);

// ==========================================
// 4. HEALTH REPORTS & RECORDS
// ==========================================
// Uses multer middleware to handle multipart/form-data. 
// Expecting the frontend FormData to append the file using the key 'report'.
// Change this:
// router.post('/health-records/upload-new-report', upload.single('report'), ctrl.uploadReport);

// To this:
router.post('/health-records/upload-new-report', upload.single('report'), uploadToS3, ctrl.uploadReport);

router.get('/health-records/recent-reports', ctrl.getRecentReports);

// File Download Route
router.get('/health-reports/:id/download', ctrl.downloadReport);

// Complex Parameterized Filter Route
router.get('/health-reports/filters/report-name=:reportName-doctor-name=:doctorName-date=:date', ctrl.filterReports);

// Metrics & Insights
router.get('/health-reports/quick-insights', ctrl.getReportInsights);
router.get('/health-reports/vitality-spark', ctrl.getReportVitality);
router.get('/health-reports/wellness-goals', ctrl.getReportGoals);
router.get('/health-reports/last-changed', ctrl.getReportLastChanged);

module.exports = router;