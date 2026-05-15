const db = require('../config/db');

class UserModel {
    // ==========================================
    // 1. TEMP VERIFICATIONS (PRE-SIGNUP)
    // ==========================================

    static async upsertTempVerification(email, phone, emailOtpHash, phoneOtpHash, expiresAt) {
        const query = `
            INSERT INTO TempVerifications (email, phone, email_otp_hash, phone_otp_hash, expires_at, is_email_verified, is_phone_verified)
            VALUES ($1, $2, $3, $4, $5, false, false)
            ON CONFLICT (email) DO UPDATE 
            SET phone = EXCLUDED.phone,
                email_otp_hash = COALESCE(EXCLUDED.email_otp_hash, TempVerifications.email_otp_hash),
                phone_otp_hash = COALESCE(EXCLUDED.phone_otp_hash, TempVerifications.phone_otp_hash),
                expires_at = EXCLUDED.expires_at,
                is_email_verified = CASE WHEN EXCLUDED.email_otp_hash IS NOT NULL THEN false ELSE TempVerifications.is_email_verified END,
                is_phone_verified = CASE WHEN EXCLUDED.phone_otp_hash IS NOT NULL THEN false ELSE TempVerifications.is_phone_verified END;
        `;
        await db.query(query, [email, phone, emailOtpHash, phoneOtpHash, expiresAt]);
    }

    static async getTempVerification(email) {
        const query = `SELECT * FROM TempVerifications WHERE email = $1;`;
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async getTempVerificationByPhone(phone) {
        const query = `SELECT * FROM TempVerifications WHERE phone = $1;`;
        const result = await db.query(query, [phone]);
        return result.rows[0];
    }

    static async markTempEmailVerified(email) {
        await db.query(`UPDATE TempVerifications SET is_email_verified = true, email_otp_hash = NULL WHERE email = $1`, [email]);
    }

    static async markTempPhoneVerified(phone) {
        await db.query(`UPDATE TempVerifications SET is_phone_verified = true, phone_otp_hash = NULL WHERE phone = $1`, [phone]);
    }

    static async deleteTempVerification(email) {
        await db.query(`DELETE FROM TempVerifications WHERE email = $1`, [email]);
    }

    // ==========================================
    // 2. CORE USER OPERATIONS
    // ==========================================

    static async createUser(userData) {
        const { role, full_name, email, phone, auth_provider, password_hash, otp_hash, otp_expires_at, google_id } = userData;

        const query = `
            INSERT INTO Users (role, full_name, email, phone, auth_provider, password_hash, otp_hash, otp_expires_at, google_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id, role, full_name, email, account_status;
        `;

        const values = [role, full_name, email, phone, auth_provider, password_hash, otp_hash, otp_expires_at, google_id || null];
        const result = await db.query(query, values);

        return result.rows[0];
    }

    static async getUserByEmail(email) {
        const query = `SELECT * FROM Users WHERE email = $1;`;
        const result = await db.query(query, [email]);
        return result.rows[0];
    }

    static async getUserByPhone(phone) {
        const query = `SELECT * FROM Users WHERE phone = $1;`;
        const result = await db.query(query, [phone]);
        return result.rows[0];
    }

    static async getUserById(id) {
        const query = `SELECT * FROM Users WHERE id = $1;`;
        const result = await db.query(query, [id]);
        return result.rows[0];
    }

    static async getUserByGoogleId(googleId) {
        const query = `SELECT * FROM Users WHERE google_id = $1;`;
        const result = await db.query(query, [googleId]);
        return result.rows[0];
    }

    static async linkGoogleAccount(userId, googleId) {
        const query = `UPDATE Users SET google_id = $1, is_email_verified = true WHERE id = $2 RETURNING *;`;
        const result = await db.query(query, [googleId, userId]);
        return result.rows[0];
    }

    static async updateVerificationStatus(userId, isVerified, type) {
        const column = type === 'email' ? 'is_email_verified' : 'is_phone_verified';
        const query = `UPDATE Users SET ${column} = $1 WHERE id = $2;`;
        await db.query(query, [isVerified, userId]);
    }

    static async updateOtp(userId, otpHash, expiryDate) {
        const query = `UPDATE Users SET otp_hash = $1, otp_expires_at = $2 WHERE id = $3;`;
        await db.query(query, [otpHash, expiryDate, userId]);
    }

    static async updatePasswordAndClearOtp(userId, newPasswordHash) {
        const query = `UPDATE Users SET password_hash = $1, otp_hash = NULL, otp_expires_at = NULL WHERE id = $2;`;
        await db.query(query, [newPasswordHash, userId]);
    }

    static async clearExpiredOtps() {
        await db.query(`UPDATE Users SET otp_hash = NULL, otp_expires_at = NULL WHERE otp_expires_at < CURRENT_TIMESTAMP;`);
        await db.query(`DELETE FROM TempVerifications WHERE expires_at < CURRENT_TIMESTAMP;`);
    }

    static async updateFcmToken(userId, fcmToken) {
        const query = `UPDATE Users SET fcm_token = $1 WHERE id = $2 RETURNING id, fcm_token;`;
        const result = await db.query(query, [fcmToken, userId]);
        return result.rows[0];
    }
}

module.exports = UserModel;