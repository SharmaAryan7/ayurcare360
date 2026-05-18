const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { requireAuth, requireRole } = require('../middlewares/authMiddleware');
const { upload, uploadToS3 } = require('../middlewares/uploadMiddleware');

router.use(requireAuth);
router.use(requireRole('doctor'));

// Dashboard
router.get('/dashboard/get-total-patients', doctorController.getTotalPatients);
router.get('/dashboard/get-appointments-today', doctorController.getAppointmentsToday);
router.get('/dashboard/get-upcoming-consultations', doctorController.getUpcomingConsultations);
router.get('/dashboard/get-recent-upcoming-appointments', doctorController.getRecentUpcomingAppointments);
router.get('/dashboard/get-earning-summary', doctorController.getEarningSummary);

// Appointments
router.get('/appointments/get-all-appointments', doctorController.getAllAppointmentsList);
router.get('/appointments/get-today-appointments', doctorController.getTodayAppointments);
router.get('/appointments/get-upcoming-appointments', doctorController.getUpcomingAppointments);
router.get('/appointments/get-completed-appointments', doctorController.getCompletedAppointments);
router.get('/appointments/get-cancelled-appointments', doctorController.getCancelledAppointments);

// Appointment Details
router.get('/appointments/:appointmentId/patient-info', doctorController.getApptPatientInfo);
router.get('/appointments/:appointmentId/symptoms', doctorController.getApptSymptoms);
router.get('/appointments/:appointmentId/get-all-patient-reports', doctorController.getApptReports);
router.get('/appointments/:appointmentId/get-patient-medical-information', doctorController.getApptMedicalInfo);
router.post('/appointments/:appointmentId/start-video-consultation', doctorController.startVideoConsultation);
router.put('/appointments/:appointmentId/reschedule-appointment', doctorController.rescheduleAppointment);
router.put('/appointments/:appointmentId/cancel-appointment', doctorController.cancelAppointment);
router.post('/appointments/:id/prescription', doctorController.submitPrescription);

// Earnings
router.get('/earnings/get-total-earnings', doctorController.getTotalEarnings);
router.get('/earnings/get-monthly-earning', doctorController.getMonthlyEarning);
router.get('/earnings/get-earning-history', doctorController.getEarningHistory);

// Profile
router.get('/profile/get-personal-information', doctorController.getProfilePersonalInfo);
router.get('/profile/get-next-consultation', doctorController.getNextConsultation);
router.get('/profile/get-contact-info', doctorController.getContactInfo);
router.get('/profile/get-credentials', doctorController.getCredentials);
router.get('/profile/get-philosophy', doctorController.getPhilosophy);

// Settings
router.get('/settings/get-personal-information', doctorController.getSettingsPersonalInfo);
router.put('/settings/update-personal-information', upload.single('avatar'), uploadToS3, doctorController.updateSettingsPersonalInfo);
router.get('/settings/get-preferences', doctorController.getPreferences);
router.put('/settings/update-preferences', doctorController.updatePreferences);
router.get('/settings/get-professional-credentials', doctorController.getProfessionalCredentials);
router.put('/settings/update-professional-credentials', doctorController.updateProfessionalCredentials);
router.get('/settings/get-consultation-logistics', doctorController.getConsultationLogistics);
router.put('/settings/update-consultation-logistic', doctorController.updateConsultationLogistics);
router.get('/settings/get-philosophy-of-care', doctorController.getPhilosophyOfCare);
router.put('/settings/update-philosophy-of-care', doctorController.updatePhilosophyOfCare);
router.put('/settings/update-account-password', doctorController.updateAccountPassword);

module.exports = router;