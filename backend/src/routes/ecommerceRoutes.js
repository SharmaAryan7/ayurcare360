const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ecommerceController');
const { requireAuth } = require('../middlewares/authMiddleware');

// ==========================================
// 1. PHARMACY STORE (Publicly Accessible)
// ==========================================
// Frontend: ecommerceApi.getAllProducts
router.get('/pharmacy-store/all', ctrl.getAllProducts);

// Frontend: ecommerceApi.getHerbalSupplements (keeping exact spelling)
router.get('/pharmacy-store/herbal-suppliments', ctrl.getHerbalSupplements);

// Frontend: ecommerceApi.getDigestiveCare
router.get('/pharmacy-store/digestive-care', ctrl.getDigestiveCare);

// Frontend: ecommerceApi.getImmunityBoosters
router.get('/pharmacy-store/immunity-booster', ctrl.getImmunityBoosters);

// Frontend: ecommerceApi.getSkinCare
router.get('/pharmacy-store/skin-care', ctrl.getSkinCare);

// Frontend: ecommerceApi.getWellnessProducts
router.get('/pharmacy-store/wellness-products', ctrl.getWellnessProducts);

// Frontend: ecommerceApi.getProductDetails
router.get('/pharmacy-store/product/:id/details', ctrl.getProductDetails);

// ==========================================
// 1.5 WEBHOOKS (Publicly Accessible, Bypasses JWT)
// ==========================================
// Action Required: Add Razorpay webhook to catch automated payment events.
// We use express.raw() here because crypto HMAC verification requires the exact bytes sent by Razorpay.
router.post('/webhook/razorpay', express.raw({ type: 'application/json' }), ctrl.handleRazorpayWebhook);

// ==========================================
// AUTHENTICATION MIDDLEWARE
// ==========================================
// Protect all Order and Cart routes below this line
router.use(requireAuth);

// ==========================================
// 2. PHARMACY ORDERS (Metrics & History)
// ==========================================
// Frontend: ecommerceApi.getInProgressOrders
router.get('/pharmacy-orders/orders/in-progress', ctrl.getInProgressOrders);

// Frontend: ecommerceApi.getShippedToday
router.get('/pharmacy-orders/orders/shipped-today', ctrl.getShippedToday);

// Frontend: ecommerceApi.getTotalSpent
router.get('/pharmacy-orders/orders/total-spent', ctrl.getTotalSpent);

// Frontend: ecommerceApi.getOrderHistory
router.get('/pharmacy-orders/order-history', ctrl.getOrderHistory);

// Frontend: ecommerceApi.filterOrderHistory (Exact parameter mapping)
router.get('/pharmacy-orders/order-history/filter/status=:status-sort-by=:sort', ctrl.filterOrderHistory);

// Frontend: ecommerceApi.getRefillReminder
router.get('/pharmacy-orders/refill-reminder', ctrl.getRefillReminder);

// Frontend: ecommerceApi.getAssistanceInfo
router.get('/pharmacy-orders/need-assistance', ctrl.getAssistanceInfo);

// Frontend: ecommerceApi.exportOrderHistory
router.get('/pharmacy-orders/order-history/export-all', ctrl.exportOrderHistory);


// ==========================================
// 3. ORDER DETAILS (:id)
// ==========================================
// Frontend: ecommerceApi.getOrderDetails
router.get('/order/:id/order-details', ctrl.getOrderDetails);

// Frontend: ecommerceApi.getOrderedProducts
router.get('/order/:id/ordered-products', ctrl.getOrderedProducts);

// Frontend: ecommerceApi.getDeliveryStatus (keeping exact spelling)
router.get('/order/:id/delivery-projects', ctrl.getDeliveryStatus);

// Frontend: ecommerceApi.getPaymentSummary
router.get('/order/:id/payment-summary', ctrl.getPaymentSummary);

// Frontend: ecommerceApi.downloadInvoice
router.get('/order/:id/download-invoice', ctrl.downloadInvoice);

// Frontend: ecommerceApi.getOrderWellnessTip
router.get('/order/:id/wellness-tip', ctrl.getOrderWellnessTip);


// ==========================================
// 4. CART & PROMO
// ==========================================
// Frontend: ecommerceApi.getCartProductDetails
router.get('/cart/product-details', ctrl.getCartProductDetails);

// Frontend: ecommerceApi.getCartOrderSummary
router.get('/cart/order-summary', ctrl.getCartOrderSummary);

// Frontend: ecommerceApi.applyPromoCode
router.post('/cart/apply-promo-code', ctrl.applyPromoCode);


// ==========================================
// 5. CHECKOUT & PAYMENT INTEGRATION
// ==========================================
// Frontend: ecommerceApi.createOrder
router.post('/ecommerce/orders', ctrl.createOrder);

// Frontend: ecommerceApi.verifyPayment
router.post('/ecommerce/orders/verify', ctrl.verifyPayment);

module.exports = router;