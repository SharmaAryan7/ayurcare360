const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // 1. Log the full error (including stack trace)
    logger.error(`${err.name}: ${err.message}`, {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        stack: err.stack,
    });

    // 2. Determine response status and message
    const statusCode = err.statusCode || 500;

    if (err.code === '23505') {
        return res.status(400).json({ error: 'Data already exists (Email/Phone unique violation).' });
    }

    // In production, avoid sending detailed server errors to the client
    const message = process.env.NODE_ENV === 'production' && statusCode === 500
        ? 'Internal Server Error'
        : err.message;

    const responsePayload = {
        success: false,
        error: message,
    };

    if (process.env.NODE_ENV !== 'production') {
        responsePayload.stack = err.stack;
    }

    res.status(statusCode).json(responsePayload);
};

module.exports = errorHandler;