const db = require('../config/db');

class PatientModel {
    // ==========================================
    // 0. CORE HELPERS & ONBOARDING
    // ==========================================
    static async getProfileByUserId(userId) {
        const query = `SELECT id FROM PatientProfiles WHERE user_id = $1;`;
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }

    static async registerPatient(userId, data) {
        const query = `
            INSERT INTO PatientProfiles (
                user_id, age, gender, blood_group, height_cm, weight_kg, bmi, 
                prakriti_type, health_history, diet_preference, allergies, address
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING id;
        `;
        const values = [
            userId, data.age, data.gender, data.blood_group, data.height_cm,
            data.weight_kg, data.bmi, data.prakriti_type, data.health_history,
            data.diet_preference, data.allergies, data.address
        ];
        const { rows } = await db.query(query, values);
        return rows[0];
    }

    static async createProfile(data) {
        const query = `
            INSERT INTO PatientProfiles (user_id) 
            VALUES ($1) 
            RETURNING id;
        `;
        const { rows } = await db.query(query, [data.user_id]);
        return rows[0];
    }

    // ==========================================
    // 1. DASHBOARD MODULE
    // ==========================================
    static async getDashPatientDetails(patientId) {
        const query = `
            SELECT 
                u.full_name, p.age, p.gender, p.blood_group, 
                p.height_cm, p.weight_kg, p.bmi, p.prakriti_type,
                p.settings->>'avatar' AS avatar
            FROM PatientProfiles p 
            JOIN Users u ON p.user_id = u.id 
            WHERE p.id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async getUpcomingAppointment(patientId) {
        const query = `
            SELECT 
                a.id, 
                a.start_time AS scheduled_at,  -- Renamed to match the frontend
                a.mode, 
                u.full_name AS "doctorName",   -- Renamed to match the frontend
                d.specialization AS specialty, -- Renamed to match the frontend
                d.avatar                       -- THE MISSING LINK: We explicitly ask for the image here!
            FROM Appointments a
            JOIN DoctorProfiles d ON a.doctor_id = d.id 
            JOIN Users u ON d.user_id = u.id
            WHERE a.patient_id = $1 AND a.status = 'Scheduled' AND a.start_time > CURRENT_TIMESTAMP
            ORDER BY a.start_time ASC 
            LIMIT 1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0] || null;
    }

    static async getWeightTrackerLogs(patientId) {
        const query = `
            SELECT DATE(created_at) AS log_date, weight 
            FROM HealthStats 
            WHERE patient_id = $1 AND weight IS NOT NULL
            ORDER BY created_at ASC 
            LIMIT 30;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getWellnessActivity(patientId) {
        const query = `
            SELECT dinacharya_routine, yoga_schedule 
            FROM WellnessPlans 
            WHERE patient_id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0] || { dinacharya_routine: null, yoga_schedule: null };
    }

    static async getMedicalHistory(patientId) {
        const query = `
            SELECT chief_complaints, medical_history, allergies 
            FROM PatientProfiles 
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async getQuickMetrics(patientId) {
        const query = `
            SELECT sleep_hours, water_intake, stress_level 
            FROM HealthLogs 
            WHERE patient_id = $1 
            ORDER BY log_date DESC 
            LIMIT 1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0] || { sleep_hours: 0, water_intake: 0, stress_level: 'Unknown' };
    }

    // ==========================================
    // 2. PROFILE MODULE
    // ==========================================
    static async getProfilePersonal(patientId) {
        const query = `
            SELECT 
                u.full_name, p.dob, p.age, p.gender, 
                p.blood_group, p.height_cm, p.weight_kg, p.bmi,
                p.settings->>'avatar' AS avatar
            FROM PatientProfiles p 
            JOIN Users u ON p.user_id = u.id 
            WHERE p.id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    // static async updateProfileMedical(patientId, data) {
    //     const query = `
    //         UPDATE PatientProfiles 
    //         SET 
    //             chief_complaints = COALESCE($1, chief_complaints),
    //             health_history = COALESCE($2, health_history),
    //             updated_at = CURRENT_TIMESTAMP
    //         WHERE id = $3 
    //         RETURNING chief_complaints, health_history;
    //     `;
    //     const { rows } = await db.query(query, [
    //         data.chief_complaints,
    //         data.health_history,
    //         patientId
    //     ]);
    //     return rows[0];
    // }

    static async updateProfilePersonal(patientId, data) {
        const query = `
            UPDATE PatientProfiles 
            SET 
                dob = COALESCE($1, dob), 
                age = COALESCE($2, age), 
                gender = COALESCE($3, gender), 
                blood_group = COALESCE($4, blood_group), 
                height_cm = COALESCE($5, height_cm), 
                weight_kg = COALESCE($6, weight_kg), 
                bmi = COALESCE($7, bmi),
                settings = CASE 
                    WHEN $8::text IS NOT NULL THEN jsonb_set(COALESCE(settings, '{}'::jsonb), '{avatar}', to_jsonb($8::text))
                    ELSE settings 
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9 
            RETURNING dob, age, gender, blood_group, height_cm, weight_kg, bmi, settings->>'avatar' AS avatar;
        `;
        const { rows } = await db.query(query, [
            data.dob, data.age, data.gender, data.blood_group,
            data.height_cm, data.weight_kg, data.bmi, data.avatar, patientId
        ]);
        return rows[0];
    }

    static async getProfileMedical(patientId) {
        const query = `
            SELECT 
                prakriti_type, health_history, vikruti, 
                diet_preference, allergies, current_medications 
            FROM PatientProfiles 
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async getProfileContact(patientId) {
        const query = `
            SELECT u.email, u.phone, p.address 
            FROM PatientProfiles p 
            JOIN Users u ON p.user_id = u.id 
            WHERE p.id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async updateProfileContact(patientId, data) {
        const query = `
            UPDATE PatientProfiles 
            SET address = COALESCE($1, address), updated_at = CURRENT_TIMESTAMP
            WHERE id = $2 
            RETURNING address;
        `;
        const { rows } = await db.query(query, [data.address, patientId]);
        return rows[0];
    }

    static async getProfileEmergency(patientId) {
        const query = `
            SELECT 
                emergency_contact_name, 
                emergency_contact_relation, 
                emergency_contact_phone 
            FROM PatientProfiles 
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async updateProfileEmergency(patientId, data) {
        const query = `
            UPDATE PatientProfiles 
            SET 
                emergency_contact_name = COALESCE($1, emergency_contact_name),
                emergency_contact_relation = COALESCE($2, emergency_contact_relation),
                emergency_contact_phone = COALESCE($3, emergency_contact_phone),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $4 
            RETURNING emergency_contact_name, emergency_contact_relation, emergency_contact_phone;
        `;
        const { rows } = await db.query(query, [
            data.emergency_contact_name,
            data.emergency_contact_relation,
            data.emergency_contact_phone,
            patientId
        ]);
        return rows[0];
    }

    // ==========================================
    // 3. SETTINGS MODULE
    // ==========================================
    static async getSettingsAccount(userId) {
        const query = `SELECT full_name, email, phone FROM Users WHERE id = $1;`;
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }

    static async updateSettingsAccount(userId, data) {
        const query = `
            UPDATE Users 
            SET full_name = COALESCE($1, full_name), phone = COALESCE($2, phone) 
            WHERE id = $3 
            RETURNING full_name, email, phone;
        `;
        const { rows } = await db.query(query, [data.full_name, data.phone, userId]);
        return rows[0];
    }

    static async getUserPasswordHash(userId) {
        const query = `SELECT password_hash FROM Users WHERE id = $1;`;
        const { rows } = await db.query(query, [userId]);
        return rows[0];
    }

    static async updateUserPassword(userId, newHash) {
        await db.query(`UPDATE Users SET password_hash = $1 WHERE id = $2;`, [newHash, userId]);
    }

    static async getSettingsJsonField(patientId, field) {
        const query = `SELECT settings->$1 AS data FROM PatientProfiles WHERE id = $2;`;
        const { rows } = await db.query(query, [field, patientId]);
        return rows[0]?.data || {};
    }

    static async updateSettingsFull(patientId, data) {
        const query = `
            UPDATE PatientProfiles 
            SET settings = settings || $1::jsonb 
            WHERE id = $2 
            RETURNING settings;
        `;
        const { rows } = await db.query(query, [JSON.stringify(data), patientId]);
        return rows[0]?.settings;
    }

    // ==========================================
    // 4. HEALTH REPORTS & RECORDS MODULE
    // ==========================================
    static async uploadReport(patientId, docName, docType, fileUrl) {
        const query = `
            INSERT INTO PatientDocuments (patient_id, document_name, document_type, file_url) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, document_name, document_type, uploaded_at, file_url;
        `;
        const { rows } = await db.query(query, [patientId, docName, docType, fileUrl]);
        return rows[0];
    }

    static async getRecentReports(patientId) {
        const query = `
            SELECT id, document_name, document_type, uploaded_at, file_url 
            FROM PatientDocuments 
            WHERE patient_id = $1 
            ORDER BY uploaded_at DESC 
            LIMIT 5;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getReportById(id, patientId) {
        const query = `
            SELECT id, document_name, file_url 
            FROM PatientDocuments 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [id, patientId]);
        return rows[0];
    }

    static async filterReports(patientId, reportName, doctorName, date) {
        let query = `
            SELECT pd.id, pd.document_name, pd.document_type, pd.uploaded_at, pd.file_url 
            FROM PatientDocuments pd
            WHERE pd.patient_id = $1
        `;
        const params = [patientId];
        let pIndex = 2;

        if (reportName && reportName !== 'undefined') {
            query += ` AND pd.document_name ILIKE $${pIndex++}`;
            params.push(`%${reportName}%`);
        }

        if (date && date !== 'undefined') {
            query += ` AND DATE(pd.uploaded_at) = $${pIndex++}`;
            params.push(date);
        }

        query += ` ORDER BY pd.uploaded_at DESC;`;
        const { rows } = await db.query(query, params);
        return rows;
    }

    static async getReportInsights(patientId) {
        const query = `
            SELECT 
                ROUND(AVG(sleep_hours), 1) AS average_sleep,
                ROUND(AVG(water_intake), 1) AS average_hydration
            FROM HealthLogs 
            WHERE patient_id = $1 AND log_date >= CURRENT_DATE - INTERVAL '30 days';
        `;
        const { rows } = await db.query(query, [patientId]);
        const data = rows[0];

        return {
            average_sleep: data.average_sleep || 0,
            hydration_status: data.average_hydration > 2 ? 'Optimal' : 'Needs Improvement',
            stress_trend: 'Stable'
        };
    }

    static async getReportVitality(patientId) {
        const query = `
            SELECT DATE(created_at) AS log_date, dosha_balance 
            FROM HealthStats 
            WHERE patient_id = $1 AND dosha_balance IS NOT NULL
            ORDER BY created_at ASC 
            LIMIT 10;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async getReportGoals(patientId) {
        const query = `SELECT prakriti_type FROM PatientProfiles WHERE id = $1;`;
        const { rows } = await db.query(query, [patientId]);
        const prakriti = rows[0]?.prakriti_type;

        let dynamicGoalTitle = 'Maintain Balance';
        if (prakriti === 'Vata') dynamicGoalTitle = 'Grounding Routine Consistency';
        if (prakriti === 'Pitta') dynamicGoalTitle = 'Cooling Diet Adherence';
        if (prakriti === 'Kapha') dynamicGoalTitle = 'Daily Vigorous Activity';

        return [
            { id: 1, title: dynamicGoalTitle, progress: 65 },
            { id: 2, title: 'Hydration Target (3L)', progress: 80 }
        ];
    }

    static async getReportLastChanged(patientId) {
        const query = `
            SELECT MAX(uploaded_at) as last_updated 
            FROM PatientDocuments 
            WHERE patient_id = $1;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0] || { last_updated: null };
    }
}

module.exports = PatientModel;