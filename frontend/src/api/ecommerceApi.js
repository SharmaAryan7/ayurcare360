import axiosInstance from './axiosConfig';

export const ecommerceApi = {
    // --- PHARMACY STORE ---
    getAllProducts: async () => (await axiosInstance.get('/pharmacy-store/all')).data,
    getHerbalSupplements: async () => (await axiosInstance.get('/pharmacy-store/herbal-suppliments')).data,
    getDigestiveCare: async () => (await axiosInstance.get('/pharmacy-store/digestive-care')).data,
    getImmunityBoosters: async () => (await axiosInstance.get('/pharmacy-store/immunity-booster')).data,
    getSkinCare: async () => (await axiosInstance.get('/pharmacy-store/skin-care')).data,
    getWellnessProducts: async () => (await axiosInstance.get('/pharmacy-store/wellness-products')).data,
    getProductDetails: async (id) => (await axiosInstance.get(`/pharmacy-store/product/${id}/details`)).data,

    // --- PHARMACY ORDERS ---
    getInProgressOrders: async () => (await axiosInstance.get('/pharmacy-orders/orders/in-progress')).data,
    getShippedToday: async () => (await axiosInstance.get('/pharmacy-orders/orders/shipped-today')).data,
    getTotalSpent: async () => (await axiosInstance.get('/pharmacy-orders/orders/total-spent')).data,
    getOrderHistory: async () => (await axiosInstance.get('/pharmacy-orders/order-history')).data,
    filterOrderHistory: async (status, sort) => (await axiosInstance.get(`/pharmacy-orders/order-history/filter/status=${status}-sort-by=${sort}`)).data,
    getRefillReminder: async () => (await axiosInstance.get('/pharmacy-orders/refill-reminder')).data,
    getAssistanceInfo: async () => (await axiosInstance.get('/pharmacy-orders/need-assistance')).data,
    exportOrderHistory: async () => (await axiosInstance.get('/pharmacy-orders/order-history/export-all', { responseType: 'blob' })).data,

    // --- ORDER DETAILS (:id) ---
    getOrderDetails: async (id) => (await axiosInstance.get(`/order/${id}/order-details`)).data,
    getOrderedProducts: async (id) => (await axiosInstance.get(`/order/${id}/ordered-products`)).data,
    getDeliveryStatus: async (id) => (await axiosInstance.get(`/order/${id}/delivery-projects`)).data, // Keeping your spelling
    getPaymentSummary: async (id) => (await axiosInstance.get(`/order/${id}/payment-summary`)).data,
    downloadInvoice: async (id) => (await axiosInstance.get(`/order/${id}/download-invoice`, { responseType: 'blob' })).data,
    getOrderWellnessTip: async (id) => (await axiosInstance.get(`/order/${id}/wellness-tip`)).data,

    // --- CART ---
    getCartProductDetails: async () => (await axiosInstance.get('/cart/product-details')).data,
    getCartOrderSummary: async () => (await axiosInstance.get('/cart/order-summary')).data,
    applyPromoCode: async (code) => (await axiosInstance.post('/cart/apply-promo-code', { code })).data,

    // --- CHECKOUT & PAYMENTS ---
    createOrder: async (payload) => {
        const response = await axiosInstance.post('/ecommerce/orders', payload);
        return response.data;
    },
    verifyPayment: async (payload) => {
        const response = await axiosInstance.post('/ecommerce/orders/verify', payload);
        return response.data;
    },
};