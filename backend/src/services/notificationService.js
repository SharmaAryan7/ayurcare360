const twilio = require('twilio');
const sgMail = require('@sendgrid/mail');
const admin = require('firebase-admin');
const logger = require('../utils/logger');

// Initialize SendGrid securely
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
    logger.warn('SENDGRID_API_KEY missing. Emails will be simulated.');
}

// Initialize Firebase Admin for Push Notifications using Base64
try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
        let serviceAccount;
        try {
            // Safely decode the base64 string back into a JSON object
            const decodedString = Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf-8');
            serviceAccount = JSON.parse(decodedString);
        } catch (parseError) {
            logger.error('CRITICAL: FIREBASE_SERVICE_ACCOUNT_BASE64 is malformed or not a valid base64 JSON string.');
            throw parseError; // Break out to the outer catch block
        }

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            logger.info('✅ Firebase Admin SDK initialized successfully via Base64 payload.');
        }
    } else {
        logger.warn('⚠️ FIREBASE_SERVICE_ACCOUNT_BASE64 missing. Push notifications disabled.');
    }
} catch (error) {
    logger.error(`Firebase Init Error: ${error.message}`);
}

class NotificationService {
    constructor() {
        if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            this.client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
            this.verifySid = process.env.TWILIO_VERIFY_SERVICE_SID;
            logger.info('✅ Twilio client initialized successfully.');
        } else {
            logger.warn('⚠️ Twilio credentials missing. SMS and Phone OTP integrations will fail.');
        }
    }

    async sendPhoneOTP(phoneNumber) {
        try {
            const verification = await this.client.verify.v2
                .services(this.verifySid)
                .verifications.create({ to: phoneNumber, channel: 'sms' });
            return verification.status;
        } catch (error) {
            logger.error(`Twilio Phone OTP Send Error: ${error.message}`);
            throw new Error('Failed to send phone verification code.');
        }
    }

    async verifyPhoneOTP(phoneNumber, code) {
        try {
            const check = await this.client.verify.v2
                .services(this.verifySid)
                .verificationChecks.create({ to: phoneNumber, code });
            return check.status === 'approved';
        } catch (error) {
            logger.error(`Twilio Phone OTP Verify Error: ${error.message}`);
            return false;
        }
    }

    async sendEmailVerification(email, otp) {
        try {
            if (!process.env.SENDGRID_API_KEY) {
                logger.warn(`Simulated Email sent to ${email} with OTP: ${otp}`);
                return true;
            }

            const msg = {
                to: email,
                from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ayurcure.com',
                subject: 'AyurCure - Your Verification Code',
                text: `Your AyurCure verification code is: ${otp}. It will expire in 5 minutes.`,
                html: `<strong>Your AyurCure verification code is: ${otp}</strong><br/>It will expire in 5 minutes.`,
            };
            await sgMail.send(msg);
            return true;
        } catch (error) {
            logger.error(`SendGrid Email Send Error: ${error.message}`);
            throw new Error('Failed to send verification email.');
        }
    }

    async sendSMS(phoneNumber, message) {
        try {
            if (!this.client) return null;
            const response = await this.client.messages.create({
                body: message,
                from: process.env.TWILIO_PHONE_NUMBER,
                to: phoneNumber
            });
            return response.sid;
        } catch (error) {
            logger.error(`Twilio Transactional SMS Error: ${error.message}`);
            return null;
        }
    }

    /**
     * Sends a push notification to a specific device via Firebase Cloud Messaging (FCM).
     * @param {string} fcmToken - Device token.
     * @param {string} title - Notification title.
     * @param {string} body - Notification body.
     * @param {object} data - Optional custom data payload (values MUST be strings).
     */
    async sendPushNotification(fcmToken, title, body, data = {}) {
        try {
            if (!admin.apps.length) return null;

            const message = {
                notification: { title, body },
                data: data,
                token: fcmToken
            };
            return await admin.messaging().send(message);
        } catch (error) {
            logger.error(`FCM Push Notification Error: ${error.message}`);
            return null;
        }
    }

    /**
     * Sends a push notification to a topic (e.g., 'offers', 'health_reminders').
     * @param {string} topic - Topic name.
     */
    async sendTopicNotification(topic, title, body, data = {}) {
        try {
            if (!admin.apps.length) return null;

            const message = {
                notification: { title, body },
                data: data,
                topic: topic
            };
            return await admin.messaging().send(message);
        } catch (error) {
            logger.error(`FCM Topic Notification Error: ${error.message}`);
            return null;
        }
    }
}

module.exports = new NotificationService();