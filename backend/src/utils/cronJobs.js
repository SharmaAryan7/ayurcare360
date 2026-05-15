const cron = require('node-cron');
const UserModel = require('../models/userModel');
const db = require('../config/db');
const logger = require('./logger');

/**
 * Executes a database sweep every minute ('* * * * *') to enforce strict OTP TTL.
 * Physically nullifies the hashed data from the PostgreSQL table once the timestamp expires.
 */
const startOtpCleanupJob = () => {
    // Schedule task to run at the start of every minute
    cron.schedule('* * * * *', async () => {
        try {
            await UserModel.clearExpiredOtps();
            // Using debug level to prevent log pollution during normal operation
            logger.debug('CRON: Expired OTP sweep completed successfully.');
        } catch (error) {
            // Escalate to error level for immediate visibility if the cleanup fails
            logger.error(`CRON ERROR: Failed to clear expired OTPs: ${error.message}`);
        }
    });
};

/**
 * Sweeps the Appointments table every 5 minutes.
 * If an appointment's end_time has passed and it is still 'Scheduled', 
 * it forces the status to 'Completed'.
 */
const startAppointmentSweepJob = () => {
    // Fixed syntax to actually run every 5 minutes ('*/5 * * * *')
    cron.schedule('*/5 * * * *', async () => {
        try {
            const query = `
                UPDATE Appointments 
                SET status = 'Completed' 
                WHERE status = 'Scheduled' AND end_time < CURRENT_TIMESTAMP
            `;
            const result = await db.query(query);
            if (result.rowCount > 0) {
                logger.info(`CRON: Swept ${result.rowCount} overdue appointments to 'Completed'.`);
            }
        } catch (error) {
            logger.error(`CRON ERROR: Failed to sweep past appointments: ${error.message}`);
        }
    });
};

/**
 * Runs every day at 17:30 (05:30 PM) to maintain DoctorSlots.
 * Deletes past slots and automatically generates new slots 
 * for the 7th day based on each doctor's availability settings.
 */
const startDoctorSlotMaintenanceJob = () => {
    cron.schedule('30 22 * * *', async () => {
        logger.info('CRON: Running daily 05:30 PM slot maintenance job...');
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // 1. Delete all slots strictly older than today (regardless of is_booked)
            const deleteResult = await client.query(`
                DELETE FROM DoctorSlots 
                WHERE DATE(start_time) < CURRENT_DATE
            `);
            logger.debug(`CRON: Deleted ${deleteResult.rowCount} old slots.`);

            // 2. Fetch all doctors and their schedule definitions
            const { rows: doctors } = await client.query(`
                SELECT id, availability_summary 
                FROM DoctorProfiles 
                WHERE availability_summary IS NOT NULL
            `);

            // 3. Set the target date exactly 7 days from today
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 7);

            const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayName = daysMap[targetDate.getDay()];

            const yyyy = targetDate.getFullYear();
            const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
            const dd = String(targetDate.getDate()).padStart(2, '0');
            const datePrefix = `${yyyy}-${mm}-${dd}`;

            let slotsCreated = 0;

            for (const doc of doctors) {
                try {
                    const schedule = typeof doc.availability_summary === 'string'
                        ? JSON.parse(doc.availability_summary)
                        : doc.availability_summary;

                    // If doctor is available on this specific day of the week, generate slots
                    if (schedule && schedule[dayName] === true) {
                        for (let hour = 9; hour < 17; hour++) {
                            const start1 = `${datePrefix} ${String(hour).padStart(2, '0')}:00:00`;
                            const end1 = `${datePrefix} ${String(hour).padStart(2, '0')}:30:00`;

                            const start2 = `${datePrefix} ${String(hour).padStart(2, '0')}:30:00`;
                            const end2 = `${datePrefix} ${String(hour + 1).padStart(2, '0')}:00:00`;

                            const insertQuery = `
                                INSERT INTO DoctorSlots (doctor_id, start_time, end_time, is_booked)
                                SELECT $1, $2, $3, false
                                WHERE NOT EXISTS (
                                    SELECT 1 FROM DoctorSlots WHERE doctor_id = $1 AND start_time = $2
                                )
                            `;
                            const res1 = await client.query(insertQuery, [doc.id, start1, end1]);
                            const res2 = await client.query(insertQuery, [doc.id, start2, end2]);

                            slotsCreated += (res1.rowCount + res2.rowCount);
                        }
                    }
                } catch (e) {
                    logger.error(`CRON ERROR: Processing slots for doctor ${doc.id}: ${e.message}`);
                }
            }

            await client.query('COMMIT');
            logger.info(`CRON: Daily slot maintenance completed successfully. Generated ${slotsCreated} new slots.`);
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error(`CRON ERROR: Slot maintenance failed: ${error.message}`);
        } finally {
            client.release();
        }
    });
};

module.exports = {
    startOtpCleanupJob,
    startAppointmentSweepJob,
    startDoctorSlotMaintenanceJob
};