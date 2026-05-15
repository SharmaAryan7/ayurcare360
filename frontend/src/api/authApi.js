import axiosInstance from './axiosConfig';

export const authApi = {
    // ==========================================
    // 1. REGISTRATION (2-Step Flow)
    // ==========================================
    sendSignupOtps: async (data) => {
        const response = await axiosInstance.post('/auth/send-signup-otps', data);
        return response.data;
    },
    verifyAndRegister: async (userData) => {
        const response = await axiosInstance.post('/auth/verify-and-register', userData);
        return response.data;
    },

    // ==========================================
    // 2. LOGIN & SSO
    // ==========================================
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        return response.data;
    },
    ssoLogin: async (data) => {
        const response = await axiosInstance.post('/auth/sso', data);
        return response.data;
    },

    // ==========================================
    // 3. PASSWORD & OTP MANAGEMENT
    // ==========================================
    verifyOtp: async (data) => {
        const response = await axiosInstance.post('/auth/verify-otp', data);
        return response.data;
    },
    resendOtp: async (data) => {
        const response = await axiosInstance.post('/auth/resend-otp', data);
        return response.data;
    },
    forgotPassword: async (payload) => {
        // payload should be { email: '...' } OR { phone: '...' }
        const response = await axiosInstance.post('/auth/forgot-password', payload);
        return response.data;
    },
    resetPassword: async (data) => {
        const response = await axiosInstance.post('/auth/reset-password', data);
        return response.data;
    },

    // ==========================================
    // 4. SESSION MANAGEMENT
    // ==========================================
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout');
        return response.data;
    },
    checkAuth: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data;
    },

    // ==========================================
    // 5. EMAIL & PHONE VERIFICATION 
    // ==========================================
    requestEmailVerification: async (email) => {
        const response = await axiosInstance.post('/auth/email/request-verification', { email });
        return response.data;
    },
    verifyEmailToken: async (data) => {
        const response = await axiosInstance.post('/auth/email/verify-token', data);
        return response.data;
    },
    requestPhoneOTP: async (phone) => {
        const response = await axiosInstance.post('/auth/phone/request-otp', { phone });
        return response.data;
    },
    verifyPhoneOTP: async (data) => {
        const response = await axiosInstance.post('/auth/phone/verify-otp', data);
        return response.data;
    },

    // ==========================================
    // 6. ACCOUNT SECURITY
    // ==========================================
    setupSsoPassword: async (newPassword) => {
        const response = await axiosInstance.post('/auth/setup-sso-password', { newPassword });
        return response.data;
    },
    updateFcmToken: async (fcm_token) => {
        const response = await axiosInstance.put('/auth/fcm-token', { fcm_token });
        return response.data;
    }
};