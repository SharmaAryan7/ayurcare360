const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
    /**
     * Generates a JSON Web Token (JWT) for stateless authentication.
     */
    generateToken(user) {
        // Admins get a 10-year token, normal users get a 10-day token
        const expiration = user.role === 'admin' ? '3650d' : '30d';

        return jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: expiration }
        );
    }

    /**
     * Generates a secure 6-digit OTP.
     */
    generateOTP() {
        return crypto.randomInt(100000, 1000000).toString();
    }

    /**
     * Hashes a plaintext string (passwords or OTPs) with salt.
     */
    async hashData(plaintext, saltRounds = 12) {
        return await bcrypt.hash(plaintext, saltRounds);
    }

    /**
     * Compares a plaintext string against a stored hash.
     */
    async verifyHash(plaintext, hash) {
        return await bcrypt.compare(plaintext, hash);
    }
}

module.exports = new AuthService();