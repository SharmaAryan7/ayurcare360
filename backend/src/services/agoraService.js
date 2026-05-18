const { RtcTokenBuilder, RtmTokenBuilder } = require('agora-token');
const logger = require('../utils/logger');

const agoraService = {
    /**
     * Generates an RTC token for a specific channel (Video/Audio).
     */
    generateRTCToken: (channelName, uid) => {
        try {
            const appId = process.env.AGORA_APP_ID;
            const appCertificate = process.env.AGORA_APP_CERTIFICATE;

            if (!appId || !appCertificate) {
                logger.warn('Agora credentials missing. Video consultations disabled.');
                throw new Error('Agora integration is not configured.');
            }

            // 1 safely represents PUBLISHER across all Agora SDK versions
            const role = 1;

            // Token expires in 2 hours for safety
            const expirationTimeInSeconds = 7200;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

            let token;

            // Version-proof RTC Token Generation
            if (RtcTokenBuilder.buildTokenWithUid.length === 7) {
                // Newer 'agora-token' package (v2) expects 7 arguments
                token = RtcTokenBuilder.buildTokenWithUid(
                    appId,
                    appCertificate,
                    channelName,
                    uid,
                    role,
                    privilegeExpiredTs,
                    privilegeExpiredTs
                );
            } else {
                // Older 'agora-access-token' package (v1) expects 6 arguments
                token = RtcTokenBuilder.buildTokenWithUid(
                    appId,
                    appCertificate,
                    channelName,
                    uid,
                    role,
                    privilegeExpiredTs
                );
            }

            return token;
        } catch (error) {
            logger.error(`Agora RTC Token Generation Error: ${error.message}`);
            throw new Error('Could not generate video token.');
        }
    },

    /**
     * Generates an RTM token for a specific user (Real-Time Messaging / Chat).
     */
    generateRTMToken: (userIdString) => {
        try {
            const appId = process.env.AGORA_APP_ID;
            const appCertificate = process.env.AGORA_APP_CERTIFICATE;

            if (!appId || !appCertificate) return null;

            const expirationTimeInSeconds = 7200;
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

            let token;

            // Version-proof RTM Token Generation
            if (RtmTokenBuilder.buildToken.length === 4) {
                // Newer 'agora-token' package (v2) - The role argument was completely removed
                token = RtmTokenBuilder.buildToken(
                    appId,
                    appCertificate,
                    userIdString,
                    privilegeExpiredTs
                );
            } else {
                // Older 'agora-access-token' package (v1) - Safely pass 1 instead of RtmRole.Rtm_User
                token = RtmTokenBuilder.buildToken(
                    appId,
                    appCertificate,
                    userIdString,
                    1,
                    privilegeExpiredTs
                );
            }

            return token;
        } catch (error) {
            logger.error(`Agora RTM Token Generation Error: ${error.message}`);
            throw new Error('Could not generate chat token.');
        }
    }
};

module.exports = agoraService;