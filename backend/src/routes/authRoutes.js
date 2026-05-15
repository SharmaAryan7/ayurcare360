const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateBodyFields } = require('../middlewares/validationMiddleware');
const { requireAuth } = require('../middlewares/authMiddleware');

// 1. REGISTRATION & LOGIN
router.post('/send-signup-otps',
    validateBodyFields(['email', 'phone']),
    authController.sendSignupOtps
);

router.post('/verify-and-register',
    validateBodyFields(['email', 'phone', 'password', 'full_name', 'emailOtp', 'phoneOtp', 'role']),
    authController.verifyAndRegister
);

router.post('/login',
    validateBodyFields(['password', 'role']),
    authController.login
);

router.post('/sso',
    validateBodyFields(['idToken', 'role']),
    authController.ssoLogin
);

// 2. EMAIL VERIFICATION 
router.post('/email/request-verification', validateBodyFields(['email']), authController.requestEmailVerification);
router.post('/email/verify-token', validateBodyFields(['email', 'token']), authController.verifyEmailToken);
router.post('/verify-otp', authController.verifyOtp);

// 3. PHONE VERIFICATION
router.post('/phone/request-otp', validateBodyFields(['phone']), authController.requestPhoneOTP);
router.post('/phone/verify-otp', requireAuth, validateBodyFields(['phone', 'otp']), authController.verifyPhoneOTP);

// 4. PASSWORD MANAGEMENT
router.post('/resend-otp', authController.resendOtp);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/setup-sso-password', requireAuth, validateBodyFields(['newPassword']), authController.setupSsoPassword);
router.put('/fcm-token', requireAuth, validateBodyFields(['fcm_token']), authController.updateFcmToken);

// 5. SESSION MANAGEMENT
router.post('/logout', authController.logout);
router.get('/me', requireAuth, authController.checkAuth);

module.exports = router;