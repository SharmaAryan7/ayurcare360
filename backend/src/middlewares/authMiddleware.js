const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Authenticates the request by validating the secure HttpOnly cookie.
 */
const requireAuth = (req, res, next) => {
    // Strictly read from HttpOnly cookies to prevent XSS attacks
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'Authentication required. Token missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        logger.error(`Auth Middleware Error: ${error.message}`);
        res.clearCookie('token');
        return res.status(403).json({ error: 'Invalid or expired secure token.' });
    }
};

/**
 * Enforces Role-Based Access Control (RBAC).
 * @param  {...string} roles - The roles authorized to access the route
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied: Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { requireAuth, requireRole };