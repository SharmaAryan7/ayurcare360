const agoraService = require('../services/agoraService');
const AppointmentModel = require('../models/appointmentModel');
const DoctorModel = require('../models/doctorModel');
const PatientModel = require('../models/patientModel');

exports.getCallToken = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        // 1. Fetch appointment details
        const appointment = await AppointmentModel.getById(appointmentId);

        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        // 2. Resolve User ID to Profile ID to properly check participation
        let profileId = null;
        if (userRole === 'patient') {
            const profile = await PatientModel.getProfileByUserId(userId);
            profileId = profile ? profile.id : null;
        } else if (userRole === 'doctor') {
            const profile = await DoctorModel.getProfileByUserId(userId);
            profileId = profile ? profile.id : null;
        }

        // 3. Security Check: Ensure the requester is the assigned doctor or patient
        if (appointment.patient_id !== profileId && appointment.doctor_id !== profileId) {
            return res.status(403).json({ error: 'Unauthorized. You are not a participant in this consultation.' });
        }

        // 4. Status Validation: Allow if Pending or Confirmed. Block if Cancelled/Completed.
        const blockedStatuses = ['Cancelled', 'Completed'];
        if (blockedStatuses.includes(appointment.status)) {
            return res.status(403).json({
                error: `Cannot join call. Appointment is currently ${appointment.status}.`
            });
        }

        // 5. Generate RTC (Video) and RTM (Chat) Tokens
        const uid = Math.floor(Math.random() * 1000000); // Random integer for RTC Video
        const rtcToken = agoraService.generateRTCToken(appointmentId, uid);

        // Use the global User ID string for RTM Chat to map directly to their account
        const rtmToken = agoraService.generateRTMToken(userId.toString());

        res.status(200).json({
            rtcToken,
            rtmToken,
            channelName: appointmentId,
            rtcUid: uid,
            rtmUid: userId.toString(),
            appId: process.env.AGORA_APP_ID
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};