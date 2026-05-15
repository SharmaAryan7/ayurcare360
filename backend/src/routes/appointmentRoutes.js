const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/appointmentController');
const { requireAuth } = require('../middlewares/authMiddleware');

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
// Protect all appointment and prescription routes
router.use(requireAuth);

// ==========================================
// 1. APPOINTMENT LISTS 
// ==========================================
router.get('/appointment/all-appointment', ctrl.getAll);
router.get('/appointment/upcoming-appointment', ctrl.getUpcoming);
router.get('/appointment/completed-appointment', ctrl.getCompleted);
router.get('/appointment/cancelled-appointment', ctrl.getCancelled);
router.get('/appointment/this-month', ctrl.getThisMonth);

// Filter with exact string parameter match
router.get('/appointment/filter/doctor-name=:docName', ctrl.filterByDoctor);

router.get('/appointment/ayurvedic-insight', ctrl.getAyurvedicInsight);
router.get('/appointment/prepare-for-your-next-visit', ctrl.getPrepInstructions);

// ==========================================
// 2. APPOINTMENT DETAILS 
// ==========================================
router.get('/appointment/:id/actions', ctrl.getActions);
router.get('/appointment/:id/your-symptoms-and-notes', ctrl.getSymptoms);
router.get('/appointment/:id/practitioner-info', ctrl.getPractitionerInfo);
router.put('/appointment/:id/cancel', ctrl.cancelAppointment);

// Documents mapping
router.get('/appointment/:id/related-documents', ctrl.getDocuments);
router.get('/appointment/:id/related-documents/download', ctrl.downloadDocument);

// ==========================================
// 3. BOOK APPOINTMENT 
// ==========================================

// THE FIX: The POST route must be here!
router.post('/book-appointment/create', ctrl.createAppointment);

router.get('/book-appointment/view-all-practitioners', ctrl.getAllPractitioners);


// Query params route (e.g., ?specialty=Vata)
router.get('/book-appointment/view-all-practitioners/filter', ctrl.filterPractitioners);

// Exact string parameter mapping
router.get('/book-appointment/view-all-practitioners/search=:docName', ctrl.searchPractitioners);

router.get('/book-appointment/view-all-practitioners/select/:docId', ctrl.selectPractitioner);

// Query params route (e.g., ?date=2024-05-10)
router.get('/book-appointment/view-all-practitioners/select/:docId/available-slots', ctrl.getAvailableSlots);

router.get('/book-appointment/view-all-practitioners/select/:docId/appointment-summary', ctrl.getBookingSummary);
router.get('/book-appointment/prakriti-analysis', ctrl.getPrakritiAnalysis);

// ==========================================
// 4. PRESCRIPTIONS 
// ==========================================
router.get('/prescription/all-prescriptions', ctrl.getAllPrescriptions);
router.get('/prescription/all-prescription/:id/view-pdf', ctrl.downloadPrescriptionPdf);
router.get('/prescription/automated-refills', ctrl.getAutomatedRefills);
router.get('/prescription/expert-consultation', ctrl.getExpertConsultation);

module.exports = router;