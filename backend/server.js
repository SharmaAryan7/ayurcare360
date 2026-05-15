require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const db = require('./src/config/db');
const cookieParser = require('cookie-parser');

// Import routes and error handler
const indexRoutes = require('./src/routes/index');
const errorHandler = require('./src/middlewares/errorHandler');
const { requireAuth } = require('./src/middlewares/authMiddleware'); // SECURE FIX: Import auth middleware
const { startOtpCleanupJob, startAppointmentSweepJob, startDoctorSlotMaintenanceJob } = require('./src/utils/cronJobs');

const app = express();

// ==========================================
// 1. SECURITY & PERFORMANCE MIDDLEWARE
// ==========================================

// SECURE FIX: Hardened Helmet Configuration
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Securely allow images to frontend while maintaining security
    contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
}));

// SECURE FIX: Dynamic CORS Configuration with strict methods and headers
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true, // Required for secure cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// ==========================================
// SECURE FIX: HTTPS ENFORCEMENT & HARDENING
// ==========================================
app.disable('x-powered-by'); // Hides that you are using Express from attackers

if (process.env.NODE_ENV === 'production') {
    // Trust the first proxy (e.g., Nginx, AWS ELB, Heroku, Vercel)
    app.set('trust proxy', 1);

    // Redirect HTTP to HTTPS
    app.use((req, res, next) => {
        if (req.headers['x-forwarded-proto'] && req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(`https://${req.headers.host}${req.url}`);
        }
        next();
    });
}

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// SECURE FIX: Catch malformed JSON payloads to prevent DoS crashes
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: 'Invalid JSON payload received.' });
    }
    next();
});

app.use(cookieParser());

if (process.env.NODE_ENV === 'production') {
    app.use(morgan('short'));
} else {
    app.use(morgan('dev'));
}

// ==========================================
// 2. RATE LIMITING
// ==========================================

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000, // SECURE FIX: Adjusted down from 10000 to a reasonable production limit
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 15,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many authentication attempts, please try again later.' }
});

app.use('/api', apiLimiter);
app.use('/api/auth', authLimiter);

// ==========================================
// 3. API ROUTES & STATIC FILES
// ==========================================

// SECURE FIX: Protect static uploads directory so the public cannot read sensitive health/user images!
app.use('/uploads', requireAuth, express.static(path.join(__dirname, 'uploads')));

app.use('/api', indexRoutes);

// Global Error Handler MUST be the last middleware
app.use(errorHandler);

// ==========================================
// 4. BOOTSTRAPPING
// ==========================================

async function startServer() {
    try {
        const { rows } = await db.query('SELECT NOW() AS current_time');
        console.log(`✅ Database Connected Successfully to Supabase at: ${rows[0].current_time}`);

        // Initialize Background Jobs
        if (typeof startOtpCleanupJob === 'function') {
            startOtpCleanupJob();
            console.log('✅ Background Jobs Started Successfully');
        } else {
            console.warn('⚠️ startOtpCleanupJob is not a valid function. Check cronJobs.js export.');
        }

        if (typeof startAppointmentSweepJob === 'function') {
            startAppointmentSweepJob();
            console.log('✅ Appointment Sweep Job Started Successfully');
        } else {
            console.warn('⚠️ startAppointmentSweepJob is not a valid function. Check cronJobs.js export.');
        }

        if (typeof startDoctorSlotMaintenanceJob === 'function') {
            startDoctorSlotMaintenanceJob();
            console.log('✅ Doctor Slot Maintenance Job Started Successfully');
        } else {
            console.warn('⚠️ startDoctorSlotMaintenanceJob is not a valid function. Check cronJobs.js export.');
        }

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`🚀 AyurCure API Server actively listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        });
    } catch (error) {
        console.error('❌ Failed to initialize application. Database connection rejected:', error.message);
        process.exit(1);
    }
}

startServer();