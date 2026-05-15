const winston = require('winston');

// Define a custom format for log output
const logFormat = winston.format.printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${stack || message}`;
});

// Construct the logger instance
const logger = winston.createLogger({
    // Dynamically adjust log levels based on the environment
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }), // Crucial for capturing full stack traces on errors
        logFormat
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                logFormat
            )
        })
        // Analytical Note: In a true production environment, you must uncomment and configure 
        // persistent file transports or a remote log aggregator (like Datadog or ELK stack) 
        // to ensure compliance and debuggability after process termination.
        // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        // new winston.transports.File({ filename: 'logs/combined.log' })
    ],
});

module.exports = logger;