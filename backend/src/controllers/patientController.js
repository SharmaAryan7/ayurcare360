const PatientModel = require('../models/patientModel');
const authService = require('../services/authService'); // Ensure you have this for password hashing/verification
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
        const profile = await PatientModel.getProfileByUserId(userId);
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
// 1. DASHBOARD
// ==========================================

exports.getDashPatientDetails = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getDashPatientDetails(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDashPatientDetails Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch dashboard patient details' });
    }
};

exports.getDashUpcomingSession = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getUpcomingAppointment(patientId);
        res.status(200).json(data); // Returns null if no upcoming session, which frontend should handle
    } catch (err) {
        logger.error(`getDashUpcomingSession Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch upcoming session' });
    }
};

exports.getDashWeightTracker = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getWeightTrackerLogs(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDashWeightTracker Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch weight tracker data' });
    }
};

exports.getDashWellnessActivity = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getWellnessActivity(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDashWellnessActivity Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch wellness activity' });
    }
};

exports.getDashMedicalHistory = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getMedicalHistory(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDashMedicalHistory Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch medical history' });
    }
};

exports.getDashQuickMetrics = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getQuickMetrics(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDashQuickMetrics Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch quick metrics' });
    }
};

// ==========================================
// 2. PROFILE
// ==========================================

exports.getProfilePersonal = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getProfilePersonal(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getProfilePersonal Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch personal info' });
    }
};

exports.updateProfilePersonal = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        // Catch the body fields
        const data = { ...req.body };

        // 🚨 Catch the AWS S3 URL!
        if (req.file) {
            data.avatar = req.file.s3Url || `/uploads/${req.file.filename}`;
        }

        const updatedData = await PatientModel.updateProfilePersonal(patientId, data);
        res.status(200).json({ message: 'Personal profile updated successfully', data: updatedData });
    } catch (err) {
        logger.error(`updateProfilePersonal Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to update personal info' });
    }
};

exports.downloadProfilePersonal = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getProfilePersonal(patientId);

        // Generate a text file representation for download
        const fileContent = `
        AyurCure - Personal Health Profile
        -----------------------------------
        Name: ${data.full_name}
        Date of Birth: ${data.dob ? new Date(data.dob).toLocaleDateString() : 'N/A'}
        Age: ${data.age || 'N/A'}
        Gender: ${data.gender || 'N/A'}
        Blood Group: ${data.blood_group || 'N/A'}
        Height: ${data.height_cm ? `${data.height_cm} cm` : 'N/A'}
        Weight: ${data.weight_kg ? `${data.weight_kg} kg` : 'N/A'}
        BMI: ${data.bmi || 'N/A'}
        `;

        res.setHeader('Content-disposition', 'attachment; filename=personal_profile.txt');
        res.setHeader('Content-type', 'text/plain');
        res.send(fileContent);
    } catch (err) {
        logger.error(`downloadProfilePersonal Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to download profile' });
    }
};

exports.getProfileMedical = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getProfileMedical(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getProfileMedical Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch medical info' });
    }
};

exports.updateProfileMedical = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.updateProfileMedical(patientId, req.body);
        res.status(200).json({ message: 'Medical info updated', data });
    } catch (err) {
        logger.error(`updateProfileMedical Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to update medical info' });
    }
};

exports.getProfileContact = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getProfileContact(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getProfileContact Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch contact info' });
    }
};

exports.updateProfileContact = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.updateProfileContact(patientId, req.body);
        res.status(200).json({ message: 'Contact info updated', data });
    } catch (err) {
        logger.error(`updateProfileContact Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to update contact info' });
    }
};

exports.getProfileEmergency = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getProfileEmergency(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getProfileEmergency Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch emergency contact' });
    }
};

exports.updateProfileEmergency = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.updateProfileEmergency(patientId, req.body);
        res.status(200).json({ message: 'Emergency contact updated', data });
    } catch (err) {
        logger.error(`updateProfileEmergency Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to update emergency contact' });
    }
};

// ==========================================
// 3. SETTINGS
// ==========================================

exports.getSettingsAccount = async (req, res) => {
    try {
        const data = await PatientModel.getSettingsAccount(req.user.id);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getSettingsAccount Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch account settings' });
    }
};

exports.updateSettingsAccount = async (req, res) => {
    try {
        const data = await PatientModel.updateSettingsAccount(req.user.id, req.body);
        res.status(200).json({ message: 'Account details updated', data });
    } catch (err) {
        logger.error(`updateSettingsAccount Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to update account settings' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Current and new passwords are required' });
        }

        const user = await PatientModel.getUserPasswordHash(req.user.id);

        // Check if user authenticated via SSO and has no local password
        if (!user.password_hash) {
            return res.status(400).json({ error: 'Account uses Single Sign-On. Please set up a password first.' });
        }

        const isValid = await authService.verifyHash(currentPassword, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Incorrect current password' });
        }

        const newHash = await authService.hashData(newPassword);
        await PatientModel.updateUserPassword(req.user.id, newHash);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        logger.error(`changePassword Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to change password' });
    }
};

exports.getSettingsNotifications = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getSettingsJsonField(patientId, 'notifications');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getSettingsNotifications Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch notifications preferences' });
    }
};

exports.getSettingsPrivacy = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getSettingsJsonField(patientId, 'privacy');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getSettingsPrivacy Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch privacy settings' });
    }
};

exports.updateSettingsData = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.updateSettingsFull(patientId, req.body);
        res.status(200).json({ message: 'Settings updated successfully', data });
    } catch (err) {
        logger.error(`updateSettingsData Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to update settings' });
    }
};

// ==========================================
// 4. HEALTH REPORTS & DOCUMENTS
// ==========================================

exports.uploadReport = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        if (!req.file) {
            return res.status(400).json({ error: 'No report file provided.' });
        }

        const { document_name, document_type } = req.body;

        const finalDocName = document_name || req.file.originalname;
        const finalDocType = document_type || 'Other';

        // 🚨 FIX: Memory storage has no .path. Must use .s3Url generated by middleware.
        const fileUrl = req.file.s3Url;

        const data = await PatientModel.uploadReport(patientId, finalDocName, finalDocType, fileUrl);
        res.status(201).json({ message: 'Report uploaded successfully', data });
    } catch (err) {
        logger.error(`uploadReport Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to upload report' });
    }
};

exports.getRecentReports = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getRecentReports(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getRecentReports Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch recent reports' });
    }
};

exports.downloadReport = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const report = await PatientModel.getReportById(req.params.id, patientId);

        if (!report) {
            return res.status(404).json({ error: 'Report not found or unauthorized access' });
        }

        // Use Express's built-in download method
        const filePath = path.resolve(report.file_url);

        if (fs.existsSync(filePath)) {
            res.download(filePath, report.document_name);
        } else {
            res.status(404).json({ error: 'File no longer exists on the server' });
        }
    } catch (err) {
        logger.error(`downloadReport Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to download report' });
    }
};

exports.filterReports = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { reportName, doctorName, date } = req.params;

        // The model handles parsing string literals like 'undefined' sent via URL parameters
        const data = await PatientModel.filterReports(patientId, reportName, doctorName, date);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`filterReports Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to filter reports' });
    }
};

exports.getReportInsights = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getReportInsights(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getReportInsights Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch report insights' });
    }
};

exports.getReportVitality = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getReportVitality(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getReportVitality Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch vitality metrics' });
    }
};

exports.getReportGoals = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getReportGoals(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getReportGoals Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch wellness goals' });
    }
};

exports.getReportLastChanged = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await PatientModel.getReportLastChanged(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getReportLastChanged Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch last changed timestamp' });
    }
};