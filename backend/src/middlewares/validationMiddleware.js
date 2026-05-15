const xss = require('xss'); // SECURE FIX: Import XSS sanitizer

/**
 * Middleware factory to validate required fields in the request body.
 * @param {Array<string>} requiredFields - List of field names that must be present.
 */
const validateBodyFields = (requiredFields) => {
    return (req, res, next) => {
        const missingFields = [];

        for (const field of requiredFields) {
            let val = req.body[field];

            if (val === undefined || val === null || String(val).trim() === '') {
                missingFields.push(field);
            } else if (typeof val === 'string') {
                // SECURE FIX: Sanitize input to prevent Stored XSS attacks
                req.body[field] = xss(val.trim());
            }
        }

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: `Missing or empty required fields: ${missingFields.join(', ')}`,
            });
        }

        next();
    };
};

module.exports = { validateBodyFields };