const express = require('express');
const router = express.Router();
const consultationController = require('../controllers/consultationController');
const { requireAuth } = require('../middlewares/authMiddleware');

// Get video and chat tokens for a specific appointment
router.get('/token/:appointmentId', requireAuth, consultationController.getCallToken);

module.exports = router;