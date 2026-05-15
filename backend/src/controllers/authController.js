const UserModel = require('../models/userModel');
const PatientModel = require('../models/patientModel');
const DoctorModel = require('../models/doctorModel');
const authService = require('../services/authService');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const setTokenCookie = (res, token, role) => {
    const maxAgeMs = role === 'admin'
        ? 10 * 365 * 24 * 60 * 60 * 1000
        : 7 * 24 * 60 * 60 * 1000;

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: maxAgeMs
    });
};

// ==========================================
// 1. LOCAL AUTHENTICATION & REGISTRATION
// ==========================================

exports.sendSignupOtps = async (req, res) => {
    try {
        let { email, phone } = req.body;
        if (!email || !phone) return res.status(400).json({ error: 'Email and Phone are required.' });

        email = email.toLowerCase().trim();

        const existingUser = await UserModel.getUserByEmail(email) || await UserModel.getUserByPhone(phone);
        if (existingUser) {
            return res.status(409).json({ error: 'Account already exists. Please login.' });
        }

        const emailOtp = authService.generateOTP();
        const phoneOtp = authService.generateOTP();
        const emailOtpHash = await authService.hashData(emailOtp);
        const phoneOtpHash = await authService.hashData(phoneOtp);
        const expiryDate = new Date(Date.now() + 5 * 60000);

        // Store generated OTPs securely in the DB
        await UserModel.upsertTempVerification(email, phone, emailOtpHash, phoneOtpHash, expiryDate);

        await Promise.all([
            notificationService.sendPhoneOTP(phone, phoneOtp).catch(err => {
                logger.error(`SMS Error: ${err.message}`);
                throw new Error('Failed to send SMS OTP.');
            }),
            notificationService.sendEmailVerification(email, emailOtp).catch(err => {
                logger.error(`Email Error: ${err.message}`);
                throw new Error('Failed to send Email OTP.');
            })
        ]);

        res.status(200).json({ message: 'Verification codes sent.' });
    } catch (error) {
        logger.error(`Pre-Signup OTP Error: ${error.message}`);
        res.status(500).json({ error: error.message || 'Failed to send verification codes.' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        let { email, phone, otp } = req.body;
        if (!otp) return res.status(400).json({ error: 'OTP is required.' });

        if (email) {
            email = email.toLowerCase().trim();
            const user = await UserModel.getUserByEmail(email);
            if (user) {
                req.body.token = otp;
                return await exports.verifyEmailToken(req, res);
            }

            const temp = await UserModel.getTempVerification(email);
            if (!temp) return res.status(400).json({ error: 'Session expired or not found. Please sign up again.' });
            if (new Date() > new Date(temp.expires_at)) return res.status(400).json({ error: 'Email OTP has expired. Please resend.' });

            const isValid = await authService.verifyHash(otp, temp.email_otp_hash);
            if (!isValid) return res.status(400).json({ error: 'Invalid Email OTP.' });

            await UserModel.markTempEmailVerified(email);
            return res.status(200).json({ message: 'Email OTP verified successfully.' });
        }

        if (phone) {
            const temp = await UserModel.getTempVerificationByPhone(phone);
            if (!temp) return res.status(400).json({ error: 'Session expired. Please sign up again.' });
            if (new Date() > new Date(temp.expires_at)) return res.status(400).json({ error: 'Phone OTP has expired. Please resend.' });

            const isValid = await authService.verifyHash(otp, temp.phone_otp_hash);
            if (!isValid) return res.status(400).json({ error: 'Invalid Phone OTP.' });

            await UserModel.markTempPhoneVerified(phone);
            return res.status(200).json({ message: 'Phone OTP verified successfully.' });
        }

        res.status(400).json({ error: 'Email or Phone required.' });
    } catch (error) {
        logger.error(`OTP Verify Error: ${error.message}`);
        res.status(500).json({ error: 'Verification failed.' });
    }
};

exports.verifyAndRegister = async (req, res) => {
    try {
        let { role, full_name, email, phone, password, emailOtp, phoneOtp } = req.body;
        email = email.toLowerCase().trim();

        const temp = await UserModel.getTempVerification(email);
        if (!temp) return res.status(401).json({ error: 'Signup session expired. Please start over.' });

        let isEmailValid = temp.is_email_verified;
        let isPhoneValid = temp.is_phone_verified;

        // Perform final verification if passed in body, otherwise check if verified in previous steps
        if (!isEmailValid && emailOtp && temp.email_otp_hash) {
            isEmailValid = await authService.verifyHash(emailOtp, temp.email_otp_hash);
        }
        if (!isPhoneValid && phoneOtp && temp.phone_otp_hash) {
            isPhoneValid = await authService.verifyHash(phoneOtp, temp.phone_otp_hash);
        }

        if (!isEmailValid || !isPhoneValid) {
            return res.status(401).json({ error: 'Invalid or expired OTPs. Please complete verification.' });
        }

        const password_hash = await authService.hashData(password);
        const newUser = await UserModel.createUser({
            role: role || 'patient',
            full_name, email, phone,
            auth_provider: 'local',
            password_hash, google_id: null
        });

        await UserModel.updateVerificationStatus(newUser.id, true, 'email');
        await UserModel.updateVerificationStatus(newUser.id, true, 'phone');

        // Wipe temporary data upon successful registration
        await UserModel.deleteTempVerification(email);

        if (role === 'doctor') {
            await DoctorModel.createProfile({ user_id: newUser.id });
        } else {
            await PatientModel.createProfile({ user_id: newUser.id });
        }

        const token = authService.generateToken(newUser);
        setTokenCookie(res, token, newUser.role);

        res.status(201).json({ message: 'Registration complete.', user: { id: newUser.id, role: newUser.role } });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ error: 'Email or phone already registered.' });
        logger.error(`Registration Error: ${error.message}`);
        res.status(500).json({ error: 'Registration failed.' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, phone, password, role } = req.body;
        let user;

        if (email) user = await UserModel.getUserByEmail(email);
        else if (phone) user = await UserModel.getUserByPhone(phone);
        else return res.status(400).json({ error: 'Email or phone required.' });

        if (!user || !user.password_hash || !(await authService.verifyHash(password, user.password_hash))) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        if (role && user.role !== role) {
            return res.status(403).json({ error: `You are registered as an admin.` });
        }

        if (user.account_status && user.account_status.toLowerCase() !== 'active') {
            return res.status(403).json({ error: `Account is ${user.account_status}.` });
        }

        const token = authService.generateToken(user);
        setTokenCookie(res, token, user.role);

        res.status(200).json({ user: { id: user.id, role: user.role } });
    } catch (error) {
        logger.error(`Login Error: ${error.message}`);
        res.status(500).json({ error: 'Login failed.' });
    }
};

// ==========================================
// 2. EMAIL / PHONE VERIFICATION (Existing Users)
// ==========================================

exports.requestEmailVerification = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.getUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        const otp = authService.generateOTP();
        const otpHash = await authService.hashData(otp);
        const expiryDate = new Date(Date.now() + 5 * 60000);

        await UserModel.updateOtp(user.id, otpHash, expiryDate);
        await notificationService.sendEmailVerification(email, otp);

        res.status(200).json({ message: 'Verification email sent.' });
    } catch (error) {
        logger.error(`Request Email Verification Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to send verification email.' });
    }
};

exports.verifyEmailToken = async (req, res) => {
    try {
        const { email, token } = req.body;
        const user = await UserModel.getUserByEmail(email);
        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (!user.otp_hash || new Date() > user.otp_expires_at) {
            return res.status(401).json({ error: 'OTP expired or invalid.' });
        }

        const isValid = await authService.verifyHash(token, user.otp_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid verification code.' });

        await UserModel.updateVerificationStatus(user.id, true, 'email');
        await UserModel.updatePasswordAndClearOtp(user.id, user.password_hash);

        const jwtToken = authService.generateToken(user);
        setTokenCookie(res, jwtToken, user.role);

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        logger.error(`Email Verify Error: ${error.message}`);
        res.status(500).json({ error: 'Verification failed.' });
    }
};

exports.requestPhoneOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ error: 'Phone number required.' });

        const otp = authService.generateOTP();
        const otpHash = await authService.hashData(otp);
        const expiryDate = new Date(Date.now() + 5 * 60000);

        await UserModel.updateOtp(req.user.id, otpHash, expiryDate);
        await notificationService.sendPhoneOTP(phone, otp);

        res.status(200).json({ message: 'Verification code sent to your phone.' });
    } catch (error) {
        logger.error(`Phone OTP Request Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to send SMS OTP.' });
    }
};

exports.verifyPhoneOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        const user = await UserModel.getUserById(req.user.id);

        if (!user.otp_hash || new Date() > user.otp_expires_at) {
            return res.status(401).json({ error: 'OTP expired or invalid.' });
        }

        const isValid = await authService.verifyHash(otp, user.otp_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid or expired phone OTP.' });

        await UserModel.updateVerificationStatus(req.user.id, true, 'phone');
        await UserModel.updatePasswordAndClearOtp(req.user.id, user.password_hash);

        res.status(200).json({ message: 'Phone number verified successfully.' });
    } catch (error) {
        logger.error(`Phone OTP Verify Error: ${error.message}`);
        res.status(500).json({ error: 'Verification failed.' });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        let { email, phone } = req.body;
        let messages = [];

        if (email) {
            email = email.toLowerCase().trim();
            const user = await UserModel.getUserByEmail(email);

            if (user) {
                // Resend to existing user
                const otp = authService.generateOTP();
                const otpHash = await authService.hashData(otp);
                await UserModel.updateOtp(user.id, otpHash, new Date(Date.now() + 5 * 60000));
                await notificationService.sendEmailVerification(email, otp);
            } else {
                // Overwrite Temp Verification record with fresh OTP
                const emailOtp = authService.generateOTP();
                const emailOtpHash = await authService.hashData(emailOtp);
                await UserModel.upsertTempVerification(email, phone || null, emailOtpHash, null, new Date(Date.now() + 5 * 60000));
                await notificationService.sendEmailVerification(email, emailOtp);
            }
            messages.push('email');
        }

        if (phone) {
            const user = await UserModel.getUserByPhone(phone);
            if (user) {
                // Resend to existing user
                const otp = authService.generateOTP();
                const otpHash = await authService.hashData(otp);
                await UserModel.updateOtp(user.id, otpHash, new Date(Date.now() + 5 * 60000));
                await notificationService.sendPhoneOTP(phone, otp);
            } else {
                // Overwrite Temp Verification record with fresh OTP
                const phoneOtp = authService.generateOTP();
                const phoneOtpHash = await authService.hashData(phoneOtp);
                const temp = await UserModel.getTempVerificationByPhone(phone);

                await UserModel.upsertTempVerification(temp ? temp.email : email, phone, null, phoneOtpHash, new Date(Date.now() + 5 * 60000));
                await notificationService.sendPhoneOTP(phone, phoneOtp);
            }
            messages.push('phone');
        }

        if (messages.length > 0) {
            return res.status(200).json({ message: `Verification code(s) sent to ${messages.join(' and ')}.` });
        }

        return res.status(400).json({ error: 'Provide either email or phone to resend OTP.' });
    } catch (error) {
        logger.error(`Resend OTP Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to resend OTP.' });
    }
};

// ==========================================
// 3. SSO & PASSWORD MANAGEMENT
// ==========================================

exports.ssoLogin = async (req, res) => {
    try {
        const { idToken, role } = req.body;
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const { email, name, email_verified, sub: google_id } = ticket.getPayload();
        if (!email_verified) return res.status(403).json({ error: 'Google email not verified.' });

        let user = await UserModel.getUserByGoogleId(google_id);
        if (!user) {
            user = await UserModel.getUserByEmail(email);
            if (user) {
                user = await UserModel.linkGoogleAccount(user.id, google_id);
            } else {
                user = await UserModel.createUser({
                    role: role || 'patient',
                    full_name: name,
                    email,
                    auth_provider: 'google',
                    google_id
                });
                await UserModel.updateVerificationStatus(user.id, true, 'email');

                if (role === 'doctor') {
                    await DoctorModel.createProfile({ user_id: user.id });
                } else {
                    await PatientModel.createProfile({ user_id: user.id });
                }
            }
        }

        const token = authService.generateToken(user);
        setTokenCookie(res, token, user.role);

        res.status(200).json({
            user: { id: user.id, role: user.role, full_name: user.full_name },
            requiresPasswordSetup: !user.password_hash
        });
    } catch (error) {
        logger.error(`SSO Error: ${error.message}`);
        res.status(401).json({ error: 'SSO Verification failed.' });
    }
};

exports.setupSsoPassword = async (req, res) => {
    try {
        const userId = req.user.id;
        const { newPassword } = req.body;

        const user = await UserModel.getUserByEmail(req.user.email);
        if (user.password_hash) return res.status(400).json({ error: 'Password already established.' });

        const password_hash = await authService.hashData(newPassword);
        await UserModel.updatePasswordAndClearOtp(userId, password_hash);

        res.status(200).json({ message: 'Password established successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to set password.' });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email, phone } = req.body;
        let user;

        if (email) user = await UserModel.getUserByEmail(email);
        else if (phone) user = await UserModel.getUserByPhone(phone);
        else return res.status(400).json({ error: 'Email or mobile number required.' });

        if (!user) return res.status(404).json({ error: 'No account found with this information.' });

        if (user.auth_provider === 'local') {
            const otp = authService.generateOTP();
            const otpHash = await authService.hashData(otp);
            const expiryDate = new Date(Date.now() + 5 * 60000);
            await UserModel.updateOtp(user.id, otpHash, expiryDate);

            if (email) await notificationService.sendEmailVerification(email, otp);
            else if (phone) await notificationService.sendPhoneOTP(phone, otp);
        }

        res.status(200).json({ message: 'If registered, a reset code has been sent.' });
    } catch (error) {
        logger.error(`Forgot Password Error: ${error.message}`);
        res.status(500).json({ error: 'Error processing request.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, phone, otp, newPassword } = req.body;
        let user;

        if (email) user = await UserModel.getUserByEmail(email);
        else if (phone) user = await UserModel.getUserByPhone(phone);
        else return res.status(400).json({ error: 'Email or mobile number required.' });

        if (!user) return res.status(404).json({ error: 'User not found.' });

        if (!user.otp_hash || new Date() > user.otp_expires_at) {
            return res.status(401).json({ error: 'OTP expired or invalid.' });
        }

        const isValid = await authService.verifyHash(otp, user.otp_hash);
        if (!isValid) return res.status(401).json({ error: 'Invalid verification code.' });

        const new_password_hash = await authService.hashData(newPassword);
        await UserModel.updatePasswordAndClearOtp(user.id, new_password_hash);

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (error) {
        logger.error(`Reset Password Error: ${error.message}`);
        res.status(500).json({ error: 'Error resetting password.' });
    }
};

exports.updateFcmToken = async (req, res) => {
    try {
        const { fcm_token } = req.body;
        await UserModel.updateFcmToken(req.user.id, fcm_token);
        res.status(200).json({ message: 'FCM token updated.' });
    } catch (error) {
        logger.error(`FCM Update Error: ${error.message}`);
        res.status(500).json({ error: 'Failed to update token.' });
    }
};

// ==========================================
// 4. SESSION MANAGEMENT
// ==========================================

exports.checkAuth = (req, res) => {
    res.status(200).json({ user: req.user });
};

exports.logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.status(200).json({ message: 'Logged out successfully.' });
};