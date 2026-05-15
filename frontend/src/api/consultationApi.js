import axiosInstance from './axiosConfig';

export const consultationApi = {
  // Fetch the Agora RTC (Video) and RTM (Chat) tokens for an appointment
  getCallToken: async (appointmentId) => {
    /*
      Returns: { 
        rtcToken, 
        rtmToken, 
        channelName, 
        rtcUid, 
        rtmUid, 
        appId 
      }
    */
    const response = await axiosInstance.get(`/consultations/token/${appointmentId}`);
    return response.data;
  }
};