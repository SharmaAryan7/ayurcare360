const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const patientRoutes = require('./patientRoutes');
const doctorRoutes = require('./doctorRoutes');
const appointmentRoutes = require('./appointmentRoutes');
const ecommerceRoutes = require('./ecommerceRoutes');
const adminRoutes = require('./adminRoutes');
const consultationRoutes = require('./consultationRoutes');

// ==========================================
// API ROUTE MOUNTING
// ==========================================

// Auth
router.use('/auth', authRoutes);

// Admin & Doctor (These were perfectly matched)
router.use('/admin', adminRoutes);
router.use('/doctors', doctorRoutes);
router.use('/consultations', consultationRoutes);

// FIX 1: Changed from '/patients' to '/patient' to match frontend patientApi.js
router.use('/patient', patientRoutes);

// FIX 2: Mounted at '/' instead of '/appointments'
// Because appointmentRoutes.js internally defines '/appointment', '/book-appointment', and '/prescription'
router.use('/', appointmentRoutes);

// FIX 3: Mounted at '/' instead of '/ecommerce'
// Because ecommerceRoutes.js internally defines '/pharmacy-store', '/pharmacy-orders', '/order', and '/cart'
router.use('/', ecommerceRoutes);

module.exports = router;