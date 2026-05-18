const AppointmentModel = require('../models/appointmentModel');

const logger = require('../utils/logger');
const path = require('path');
const fs = require('fs');

// ==========================================
// UTILITY HELPERS
// ==========================================

/**
 * Resolves the authenticated User ID to their specific Patient Profile ID.
 * Returns null and handles the response if the profile is incomplete.
 */
const getPatientId = async (userId, res) => {
    try {
        const profile = await AppointmentModel.getPatientIdByUserId(userId);
        if (!profile) {
            res.status(404).json({ error: 'Patient profile not found. Please complete onboarding.' });
            return null;
        }
        return profile.id;
    } catch (error) {
        logger.error(`Error resolving patient ID: ${error.message}`);
        res.status(500).json({ error: 'Internal server error while verifying profile.' });
        return null;
    }
};

// ==========================================
// 1. APPOINTMENT LISTS
// ==========================================

// --- UPDATE THIS FUNCTION ---
exports.getAll = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        // Capture pagination params from URL query (default to page 1, 10 items)
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const offset = (page - 1) * limit;

        const result = await AppointmentModel.getAll(patientId, limit, offset);

        res.status(200).json({
            success: true,
            appointments: result.data,
            pagination: {
                total: result.total,
                currentPage: page,
                totalPages: Math.ceil(result.total / limit),
                limit: limit
            }
        });
    } catch (err) {
        logger.error(`getAllAppointments Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

exports.getUpcoming = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getUpcoming(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getUpcoming Appointments Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch upcoming appointments' });
    }
};

exports.getCompleted = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getCompleted(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getCompleted Appointments Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch completed appointments' });
    }
};

exports.getCancelled = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getCancelled(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getCancelled Appointments Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch cancelled appointments' });
    }
};

exports.getThisMonth = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getThisMonth(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getThisMonth Appointments Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch this month appointments' });
    }
};

exports.filterByDoctor = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const { docName } = req.params;
        const data = await AppointmentModel.filterByDoctor(patientId, docName);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`filterByDoctor Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to filter appointments' });
    }
};

exports.getAyurvedicInsight = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getAyurvedicInsight(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getAyurvedicInsight Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch ayurvedic insights' });
    }
};

exports.getPrepInstructions = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getPrepInstructions(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getPrepInstructions Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch preparation instructions' });
    }
};

// ==========================================
// 2. APPOINTMENT DETAILS (:id)
// ==========================================

exports.getActions = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getActions(req.params.id, patientId);
        if (!data) return res.status(404).json({ error: 'Appointment not found' });
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getActions Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch appointment actions' });
    }
};

exports.getSymptoms = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getSymptoms(req.params.id, patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getSymptoms Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch symptoms' });
    }
};

exports.getPractitionerInfo = async (req, res) => {
    try {
        // 1. THE TRACKER: Let's see what the auth middleware is actually giving us!
        console.log("🚨 FULL REQ.USER OBJECT:", req.user);

        // Try to grab the ID from a few common places just in case!
        const patientId = req.user?.id || req.user?.userId || req.user?._id || null;
        console.log("🚨 CHECKING PATIENT ID:", patientId);

        // Fetch the data
        const info = await AppointmentModel.getPractitionerInfo(req.params.id, patientId);

        // 2. THE SAFETY NET: If the database finds nothing, stop here so we don't crash!
        if (!info) {
            console.log("🚨 DB ERROR: Found 0 rows. The appointment ID or patientId is wrong!");
            return res.status(404).json({ error: 'Practitioner info not found' });
        }

        // If we get here, it worked! Send the data.
        res.status(200).json({
            doctor_name: info.doctor_name,
            email: info.email,
            phone: info.phone,
            specialization: info.specialization,
            experience_years: info.experience_years,
            qualifications: info.qualifications,
            bio: info.bio,
            avatar: info.avatar
        });
    } catch (err) {
        console.error(`getPractitionerInfo Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch practitioner info' });
    }
};

exports.getDocuments = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;
        const data = await AppointmentModel.getDocuments(req.params.id, patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDocuments Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch related documents' });
    }
};

exports.downloadDocument = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        // Note: Here req.params.id refers to the document ID as passed by the UI route mapping
        const document = await AppointmentModel.getDocumentById(req.params.id, patientId);
        if (!document) return res.status(404).json({ error: 'Document not found' });

        const filePath = path.resolve(document.file_url);
        if (fs.existsSync(filePath)) {
            res.download(filePath, document.document_name);
        } else {
            res.status(404).json({ error: 'File missing from server' });
        }
    } catch (err) {
        logger.error(`downloadDocument Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to download document' });
    }
};


// ==========================================
// 3. BOOK APPOINTMENT
// ==========================================

exports.createAppointment = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const db = require('../config/db');
        const { doctorId, date, time, reason, paymentId } = req.body;

        const [timePart, modifier] = time.split(' ');
        let [hours, minutes] = timePart.split(':');
        if (modifier === 'PM' && hours !== '12') hours = parseInt(hours, 10) + 12;
        if (modifier === 'AM' && hours === '12') hours = '00';
        hours = hours.toString().padStart(2, '0');

        const exactTimestamp = `${date} ${hours}:${minutes}:00`;

        // MARK THE SLOT AS BOOKED IN THE DB
        const slotUpdate = await db.query(`
            UPDATE DoctorSlots 
            SET is_booked = true 
            WHERE doctor_id = $1 AND start_time = $2::timestamp
            RETURNING id
        `, [doctorId, exactTimestamp]);

        const assignedSlotId = slotUpdate.rows.length > 0 ? slotUpdate.rows[0].id : null;

        // CREATE APPOINTMENT RECORD WITH SLOT REFERENCE
        const apptQuery = `
            INSERT INTO Appointments (patient_id, doctor_id, slot_id, start_time, end_time, mode, status, chief_complaint)
            VALUES ($1, $2, $3, $4::timestamp, $4::timestamp + interval '30 minutes', 'Video', 'Scheduled', $5)
            RETURNING id
        `;
        const { rows } = await db.query(apptQuery, [patientId, doctorId, assignedSlotId, exactTimestamp, reason]);

        res.status(201).json({ success: true, appointmentId: rows[0].id });
    } catch (err) {
        console.error(`createAppointment Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};

exports.getAllPractitioners = async (req, res) => {
    try {
        const data = await AppointmentModel.getAllPractitioners();
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getAllPractitioners Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch practitioners' });
    }
};

exports.filterPractitioners = async (req, res) => {
    try {
        const filters = req.query; // Extracts query parameters (e.g., ?specialty=Vata)
        const data = await AppointmentModel.filterPractitioners(filters);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`filterPractitioners Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to filter practitioners' });
    }
};

exports.searchPractitioners = async (req, res) => {
    try {
        const { docName } = req.params;
        const data = await AppointmentModel.searchPractitioners(docName);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`searchPractitioners Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to search practitioners' });
    }
};

exports.selectPractitioner = async (req, res) => {
    try {
        const { docId } = req.params;
        const data = await AppointmentModel.selectPractitioner(docId);
        if (!data) return res.status(404).json({ error: 'Practitioner not found' });
        res.status(200).json(data);
    } catch (err) {
        logger.error(`selectPractitioner Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch practitioner details' });
    }
};

exports.getAvailableSlots = async (req, res) => {
    try {
        const { docId } = req.params;
        const { date } = req.query; // e.g., 2026-05-16

        if (!date) return res.status(400).json({ error: 'Date query parameter is required' });

        const db = require('../config/db');

        // Safely format date for PostgreSQL matching
        let formattedDate = date;
        if (date.includes('/')) {
            const parts = date.split('/');
            formattedDate = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        }

        // Fetch slots natively from the database schema
        const query = `
            SELECT id AS slot_id, start_time, is_booked 
            FROM DoctorSlots 
            WHERE doctor_id = $1 AND DATE(start_time) = $2::date
            ORDER BY start_time ASC
        `;
        const { rows } = await db.query(query, [docId, formattedDate]);

        if (rows.length === 0) return res.status(200).json([]);

        // Handle past times check for "today"
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const isToday = formattedDate === todayStr;

        const formattedSlots = rows.map(slot => {
            const st = new Date(slot.start_time);
            const hours = st.getHours();
            const minutes = st.getMinutes();

            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHour = hours % 12 || 12;

            let pastTimeCheck = false;
            if (isToday && (hours < now.getHours() || (hours === now.getHours() && minutes <= now.getMinutes()))) {
                pastTimeCheck = true;
            }

            return {
                slotId: slot.slot_id,
                timeStr: `${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`,
                rawTime: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
                isBooked: slot.is_booked || pastTimeCheck
            };
        });

        res.status(200).json(formattedSlots);
    } catch (err) {
        console.error(`getAvailableSlots Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch available slots' });
    }
};

exports.getBookingSummary = async (req, res) => {
    try {
        const { docId } = req.params;
        const practitioner = await AppointmentModel.selectPractitioner(docId);

        if (!practitioner) return res.status(404).json({ error: 'Practitioner not found' });

        // Build the dynamic summary for the frontend
        const summary = {
            doctor: {
                id: practitioner.doctor_id,
                name: practitioner.full_name,
                specialty: practitioner.specialization
            },
            fees: {
                consultation: practitioner.consultation_fee,
                taxes: parseFloat((practitioner.consultation_fee * 0.18).toFixed(2)), // Assuming 18% tax
                platform_fee: 50.00
            },
            policies: [
                "Free cancellation up to 24 hours before the appointment.",
                "Rescheduling is subject to slot availability.",
                "Please join the consultation 5 minutes early."
            ]
        };

        res.status(200).json(summary);
    } catch (err) {
        logger.error(`getBookingSummary Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch booking summary' });
    }
};

exports.getPrakritiAnalysis = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await AppointmentModel.getPrakritiAnalysis(patientId);
        res.status(200).json(data || { prakriti_type: 'Not Assessed', dosha_balance: null });
    } catch (err) {
        logger.error(`getPrakritiAnalysis Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch Prakriti Analysis' });
    }
};

exports.cancelAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const db = require('../config/db'); // Make sure this path matches your db config file

        // Update the status to 'Cancelled' in PostgreSQL
        await db.query(`UPDATE Appointments SET status = 'Cancelled' WHERE id = $1`, [id]);

        res.status(200).json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (err) {
        console.error("Cancel Error:", err);
        res.status(500).json({ error: 'Failed to cancel appointment' });
    }
};
// ==========================================
// 4. PRESCRIPTIONS
// ==========================================


exports.getPrescription = async (req, res) => {
    try {
        const { id } = req.params; // appointment_id
        const db = require('../config/db'); 
        
        // FIX: Select all columns, not just lifestyle_advice
        const query = `SELECT * FROM prescriptions WHERE appointment_id = $1`;
        const { rows } = await db.query(query, [id]);
        
        if (rows.length === 0) {
            return res.json({ lifestyle_advice: null });
        }
        
        // If you dropped the UNIQUE constraint and allow multiple rows, return all rows
        // Otherwise, return rows[0] if it's a single row
        res.json(rows.length > 1 ? rows : rows[0]);
    } catch (err) {
        console.error("GET PRESCRIPTION ERROR:", err);
        res.status(500).json({ error: 'Failed to fetch prescription' });
    }
};

exports.getAllPrescriptions = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await AppointmentModel.getAllPrescriptions(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getAllPrescriptions Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch prescriptions' });
    }
};

exports.downloadPrescriptionPdf = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const prescriptionId = req.params.id;
        const data = await AppointmentModel.getPrescriptionForPdf(prescriptionId, patientId);

        if (!data) return res.status(404).json({ error: 'Prescription not found' });

        // Simulating PDF generation by sending a formatted text file (or buffer stream in production using PDFKit)
        const fileContent = `
            AYURCURE DIGITAL PRESCRIPTION
            -------------------------------------------------
            Doctor: ${data.doctor_name} (${data.specialization})
            Reg No: ${data.registration_number}
            Date: ${new Date(data.appointment_date).toLocaleDateString()}
            
            Patient: ${data.patient_name} (Age: ${data.age}, Gender: ${data.gender})
            -------------------------------------------------
            MEDICINE: ${data.medicine_name}
            DOSAGE: ${data.dosage}
            TIMING: ${data.timing}
            DURATION: ${data.duration}
            
            LIFESTYLE ADVICE:
            ${data.lifestyle_advice || 'Maintain a balanced diet and regular routine.'}
            -------------------------------------------------
            *Electronically generated document*
        `;

        res.setHeader('Content-disposition', `attachment; filename=Prescription_${prescriptionId}.txt`);
        res.setHeader('Content-type', 'text/plain');
        res.send(fileContent);
    } catch (err) {
        logger.error(`downloadPrescriptionPdf Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to generate prescription file' });
    }
};

exports.getAutomatedRefills = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await AppointmentModel.getAutomatedRefills(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getAutomatedRefills Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch refill data' });
    }
};

exports.getExpertConsultation = async (req, res) => {
    try {
        // Return static mock data for expert consultation prompts
        const consultationSuggestions = [
            { id: 1, title: 'Dietary Consultation', description: 'Speak to a specialist regarding your Ayurvedic diet.' },
            { id: 2, title: 'Yoga Therapy', description: 'Schedule a session to adjust your yoga regimen based on your doshas.' }
        ];
        res.status(200).json(consultationSuggestions);
    } catch (err) {
        logger.error(`getExpertConsultation Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch consultation suggestions' });
    }
};