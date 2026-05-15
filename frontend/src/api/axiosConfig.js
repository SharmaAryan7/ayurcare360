import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true, // Ensures secure HttpOnly cookies are sent with every request
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Development logging for easier debugging
        if (import.meta.env.DEV) {
            console.groupCollapsed(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`);
            console.error('Status:', error.response?.status || 'Network Error');
            console.error('Server Error:', error.response?.data?.error || error.message);
            console.groupEnd();
        }

        // Standardize error messaging for UI components
        error.customMessage =
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message ||
            "An unexpected error occurred.";

        // Global unauthorized handler (e.g., expired HttpOnly cookie)
        if (error.response?.status === 401) {
            localStorage.removeItem('role'); // Clear UI routing state

            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;