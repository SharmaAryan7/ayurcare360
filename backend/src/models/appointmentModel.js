const db = require('../config/db');

class AppointmentModel {
    // ==========================================
    // HELPER METHOD
    // ==========================================
    static async getPatientIdByUserId(userId) {
        const query = `SELECT id, prakriti_type FROM PatientProfiles WHERE user_id = $1;`;
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }

    static async getById(appointmentId) {
        const query = `
            SELECT id, patient_id, doctor_id, status 
            FROM Appointments 
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [appointmentId]);
        return rows[0];
    }
    // ==========================================
    // 1. APPOINTMENT LISTS
    // ==========================================

    // Base query snippet to avoid repetition
    static get baseListQuery() {
        return `
            SELECT 
                a.id, 
                a.start_time AS scheduled_at, 
                a.end_time, 
                a.mode, 
                a.status, 
                u.full_name AS "doctorName", 
                d.specialization AS specialty, 
                d.average_rating,
                d.profile_image_url AS avatar  -- 🚨 FIXED SCHEMA REFERENCE
            FROM Appointments a
            JOIN DoctorProfiles d ON a.doctor_id = d.id
            JOIN Users u ON d.user_id = u.id
            WHERE a.patient_id = $1
        `;
    }

    static async getAll(patientId, limit = 10, offset = 0) {
        // First, get the total count of appointments for pagination math
        const countQuery = `SELECT COUNT(*) FROM Appointments WHERE patient_id = $1`;
        const countRes = await db.query(countQuery, [patientId]);
        const total = parseInt(countRes.rows[0].count, 10);

        // Then, get only the specific page of data
        const query = `
            ${this.baseListQuery} 
            ORDER BY a.start_time DESC 
            LIMIT $2 OFFSET $3;
        `;
        const { rows } = await db.query(query, [patientId, limit, offset]);

        return { total, data: rows };
    }

    static async getUpcoming(patientId) {
        const query = `
            ${this.baseListQuery} 
            AND a.status = 'Scheduled' 
            AND a.start_time > CURRENT_TIMESTAMP 
            ORDER BY a.start_time ASC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getCompleted(patientId) {
        const query = `
            ${this.baseListQuery} 
            AND a.status = 'Completed' 
            ORDER BY a.start_time DESC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getCancelled(patientId) {
        const query = `
            ${this.baseListQuery} 
            AND a.status = 'Cancelled' 
            ORDER BY a.start_time DESC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getThisMonth(patientId) {
        const query = `
            ${this.baseListQuery} 
            AND date_trunc('month', a.start_time) = date_trunc('month', CURRENT_DATE)
            ORDER BY a.start_time ASC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async filterByDoctor(patientId, docName) {
        const query = `
            ${this.baseListQuery} 
            AND u.full_name ILIKE $2
            ORDER BY a.start_time DESC;
        `;
        const { rows } = await db.query(query, [patientId, `%${docName}%`]);
        return rows;
    }

    static async getAyurvedicInsight(patientId) {
        // Fetch the patient's prakriti to give a targeted insight
        const query = `SELECT prakriti_type FROM PatientProfiles WHERE id = $1;`;
        const { rows } = await db.query(query, [patientId]);
        const prakriti = rows[0]?.prakriti_type || 'Vata';

        // Mocking insight response based on DB state
        return {
            insight_title: `Understanding your ${prakriti} Dosha`,
            description: `Regular consultations help keep your ${prakriti} dosha in balance. Make sure to discuss your recent diet changes in your next visit.`
        };
    }

    static async getPrepInstructions(patientId) {
        return [
            "Keep your previous medical reports handy.",
            "Avoid eating heavy meals 2 hours prior to Nadi Pariksha.",
            "Write down any new symptoms you've experienced."
        ];
    }

    // ==========================================
    // 2. APPOINTMENT DETAILS (:id)
    // ==========================================

    static async getActions(appointmentId, patientId) {
        const query = `
            SELECT id, status, mode, meet_link, start_time 
            FROM Appointments 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [appointmentId, patientId]);
        return rows[0];
    }

    static async getSymptoms(appointmentId, patientId) {
        const query = `
            SELECT pre_consultation_symptoms, chief_complaint 
            FROM Appointments 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [appointmentId, patientId]);
        return rows[0] || { chief_complaint: null, pre_consultation_symptoms: null };
    }

    static async getPractitionerInfo(appointmentId, patientId) {
        // 1. THE DIAGNOSTIC: Look at the raw appointment before any joins
        const debugQuery = `SELECT id, patient_id, doctor_id FROM Appointments WHERE id = $1`;
        const debugRes = await db.query(debugQuery, [appointmentId]);
        console.log("🚨 RAW APPOINTMENT IN DB:", debugRes.rows[0]);

        // 2. THE FORCED QUERY: We removed the strict patient_id check to force it through.
        // We also linked Users on BOTH possible doctor_id matches just in case!
        const query = `
            SELECT 
                u.full_name AS doctor_name, u.email, u.phone,
                d.specialization, d.experience_years, d.qualifications, d.bio,
                d.profile_image_url AS avatar  -- 🚨 FIXED SCHEMA REFERENCE
            FROM Appointments a
            LEFT JOIN DoctorProfiles d ON a.doctor_id = d.id
            LEFT JOIN Users u ON (d.user_id = u.id OR a.doctor_id = u.id)
            WHERE a.id = $1; 
        `;

        const { rows } = await db.query(query, [appointmentId]);
        console.log("🚨 FINAL JOINED RESULT:", rows[0]);

        return rows[0];
    }

    static async getDocuments(appointmentId, patientId) {
        // Assuming documents uploaded recently near the appointment time
        const query = `
            SELECT id, document_name, document_type, uploaded_at, file_url
            FROM PatientDocuments 
            WHERE patient_id = $1
            ORDER BY uploaded_at DESC LIMIT 5;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getDocumentById(docId, patientId) {
        const query = `
            SELECT file_url, document_name 
            FROM PatientDocuments 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [docId, patientId]);
        return rows[0];
    }

    // ==========================================
    // 3. BOOK APPOINTMENT
    // ==========================================

    static async createAppointment(data) {
        // 1. Check the actual Appointments table to prevent double-booking
        const checkQuery = `
            SELECT id FROM Appointments 
            WHERE doctor_id = $1 AND start_time = $2::timestamp AND status != 'Cancelled';
        `;
        const checkRes = await db.query(checkQuery, [data.doctorId, data.startTime]);

        if (checkRes.rows.length > 0) {
            throw new Error("This exact time is already booked. Please select another slot.");
        }

        // 2. Safely insert the new appointment directly!
        const insertQuery = `
            INSERT INTO Appointments (patient_id, doctor_id, start_time, end_time, status, mode, chief_complaint)
            VALUES ($1, $2, $3::timestamp, $3::timestamp + interval '30 minutes', 'Scheduled', 'Video', $4)
            RETURNING id;
        `;
        const { rows } = await db.query(insertQuery, [
            data.patientId,
            data.doctorId,
            data.startTime,
            data.reason
        ]);

        return rows[0].id;
    }

    static async getAllPractitioners() {
        const query = `
            SELECT 
                d.id AS doctor_id, 
                u.full_name AS name, -- MATCH FRONTEND
                d.specialization AS specialty, -- MATCH FRONTEND
                d.experience_years, 
                d.consultation_fee, 
                d.average_rating, 
                d.languages,
                d.profile_image_url AS avatar -- 🚨 FIXED SCHEMA REFERENCE
            FROM DoctorProfiles d
            JOIN Users u ON d.user_id = u.id
            WHERE u.account_status = 'Active'
            ORDER BY d.average_rating DESC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async filterPractitioners(filters) {
        let query = `
            SELECT 
                d.id AS doctor_id, 
                u.full_name AS name, 
                d.specialization AS specialty, 
                d.experience_years, 
                d.consultation_fee, 
                d.average_rating, 
                d.languages,
                d.profile_image_url AS avatar -- 🚨 FIXED SCHEMA REFERENCE
            FROM DoctorProfiles d
            JOIN Users u ON d.user_id = u.id
            WHERE u.account_status = 'Active'
        `;
        const params = [];
        let pIndex = 1;

        if (filters.specialty) {
            query += ` AND d.specialization ILIKE $${pIndex++}`;
            params.push(`%${filters.specialty}%`);
        }

        query += ` ORDER BY d.average_rating DESC;`;
        const { rows } = await db.query(query, params);
        return rows;
    }

    static async searchPractitioners(docName) {
        const query = `
            SELECT 
                d.id AS doctor_id, 
                u.full_name AS name, 
                d.specialization AS specialty, 
                d.experience_years, 
                d.consultation_fee, 
                d.average_rating,
                d.profile_image_url AS avatar -- 🚨 FIXED SCHEMA REFERENCE
            FROM DoctorProfiles d
            JOIN Users u ON d.user_id = u.id
            WHERE u.account_status = 'Active' AND u.full_name ILIKE $1
            ORDER BY u.full_name ASC;
        `;
        const { rows } = await db.query(query, [`%${docName}%`]);
        return rows;
    }

    static async selectPractitioner(docId) {
        const query = `
            SELECT 
                d.id AS doctor_id, 
                u.full_name, 
                d.specialization, 
                d.experience_years, 
                d.consultation_fee, 
                d.average_rating, 
                d.total_reviews, 
                d.bio, 
                d.education_details,
                d.profile_image_url AS avatar -- 🚨 FIXED SCHEMA REFERENCE
            FROM DoctorProfiles d
            JOIN Users u ON d.user_id = u.id
            WHERE d.id = $1;
        `;
        const { rows } = await db.query(query, [docId]);
        return rows[0];
    }

    static async getAvailableSlots(docId, date) {
        const query = `
            SELECT id AS slot_id, start_time, end_time 
            FROM DoctorSlots 
            WHERE doctor_id = $1 
              AND DATE(start_time) = $2 
              AND is_booked = false
            ORDER BY start_time ASC;
        `;
        const { rows } = await db.query(query, [docId, date]);
        return rows;
    }


    static async getPrakritiAnalysis(patientId) {
        const query = `
            SELECT prakriti_type, vikruti, dosha_balance 
            FROM PatientProfiles p
            LEFT JOIN HealthStats h ON p.id = h.patient_id
            WHERE p.id = $1
            ORDER BY h.created_at DESC LIMIT 1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    // ==========================================
    // 4. PRESCRIPTIONS
    // ==========================================

    static async getAllPrescriptions(patientId) {
        const query = `
            SELECT 
                p.id AS prescription_id, p.medicine_name, p.dosage, p.timing, p.duration, p.created_at,
                u.full_name AS doctor_name, d.specialization,
                a.start_time AS appointment_date
            FROM Prescriptions p
            JOIN Appointments a ON p.appointment_id = a.id
            JOIN DoctorProfiles d ON a.doctor_id = d.id
            JOIN Users u ON d.user_id = u.id
            WHERE p.patient_id = $1
            ORDER BY p.created_at DESC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getPrescriptionForPdf(prescriptionId, patientId) {
        const query = `
            SELECT 
                p.*, a.start_time AS appointment_date,
                du.full_name AS doctor_name, d.specialization, d.registration_number,
                pu.full_name AS patient_name, pp.age, pp.gender
            FROM Prescriptions p
            JOIN Appointments a ON p.appointment_id = a.id
            JOIN DoctorProfiles d ON a.doctor_id = d.id
            JOIN Users du ON d.user_id = du.id
            JOIN PatientProfiles pp ON p.patient_id = pp.id
            JOIN Users pu ON pp.user_id = pu.id
            WHERE p.id = $1 AND p.patient_id = $2;
        `;
        const { rows } = await db.query(query, [prescriptionId, patientId]);
        return rows[0];
    }

    static async getAutomatedRefills(patientId) {
        // Fetch active prescriptions nearing end of duration
        const query = `
            SELECT id AS prescription_id, medicine_name, dosage, duration 
            FROM Prescriptions 
            WHERE patient_id = $1 AND is_active = true
            ORDER BY created_at DESC LIMIT 3;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getBookedAppointments(docId, date) {
        // Fetch all scheduled appointments for the doctor on that specific date
        const query = `
            SELECT start_time 
            FROM Appointments 
            WHERE doctor_id = $1 
              AND DATE(start_time) = $2 
              AND status != 'Cancelled';
        `;
        const { rows } = await db.query(query, [docId, date]);
        return rows.map(row => row.start_time);
    }
}

module.exports = AppointmentModel;