const EcommerceModel = require('../models/ecommerceModel');
const PatientModel = require('../models/patientModel');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
const { generateInvoicePdf } = require('../utils/generatePdf');
const paymentService = require('../services/paymentService');

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
// 1. PHARMACY STORE MODULE
// ==========================================

exports.getAllProducts = async (req, res) => {
    try {
        const data = await EcommerceModel.getAllProducts();
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getAllProducts Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch all products' });
    }
};

exports.getHerbalSupplements = async (req, res) => {
    try {
        const data = await EcommerceModel.getProductsByCategory('Herbal');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getHerbalSupplements Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch herbal supplements' });
    }
};

exports.getDigestiveCare = async (req, res) => {
    try {
        const data = await EcommerceModel.getProductsByCategory('Digestive');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDigestiveCare Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch digestive care products' });
    }
};

exports.getImmunityBoosters = async (req, res) => {
    try {
        const data = await EcommerceModel.getProductsByCategory('Immunity');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getImmunityBoosters Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch immunity boosters' });
    }
};

exports.getSkinCare = async (req, res) => {
    try {
        const data = await EcommerceModel.getProductsByCategory('Skin');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getSkinCare Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch skin care products' });
    }
};

exports.getWellnessProducts = async (req, res) => {
    try {
        const data = await EcommerceModel.getProductsByCategory('Wellness');
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getWellnessProducts Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch wellness products' });
    }
};

exports.getProductDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await EcommerceModel.getProductDetails(id);

        if (!data) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(data);
    } catch (err) {
        logger.error(`getProductDetails Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch product details' });
    }
};

// ==========================================
// 2. PHARMACY ORDERS MODULE
// ==========================================

exports.getInProgressOrders = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await EcommerceModel.getInProgressOrdersCount(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getInProgressOrders Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch in-progress orders' });
    }
};

exports.getShippedToday = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await EcommerceModel.getShippedTodayCount(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getShippedToday Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch orders shipped today' });
    }
};

exports.getTotalSpent = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await EcommerceModel.getTotalSpent(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getTotalSpent Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch total spent amount' });
    }
};

exports.getOrderHistory = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await EcommerceModel.getOrderHistory(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getOrderHistory Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch order history' });
    }
};

exports.filterOrderHistory = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { status, sort } = req.params;
        const data = await EcommerceModel.filterOrderHistory(patientId, status, sort);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`filterOrderHistory Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to filter order history' });
    }
};

exports.getRefillReminder = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await EcommerceModel.getRefillReminder(patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getRefillReminder Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch refill reminders' });
    }
};

exports.getAssistanceInfo = async (req, res) => {
    try {
        const assistanceInfo = {
            support_email: "pharmacy@ayurcure.com",
            support_phone: "+91-1800-AYUR-CARE",
            faq_link: "/support/pharmacy-faq",
            message: "Our Ayurvedic pharmacists are available Mon-Sat, 9 AM to 8 PM."
        };
        res.status(200).json(assistanceInfo);
    } catch (err) {
        logger.error(`getAssistanceInfo Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch assistance info' });
    }
};

exports.exportOrderHistory = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const data = await EcommerceModel.exportOrderHistory(patientId);

        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'No order history found to export' });
        }

        // Generate CSV format
        let csvContent = "Order ID,Date,Product,Quantity,Price,Status,Total Amount\n";
        data.forEach(row => {
            const date = new Date(row.created_at).toLocaleDateString();
            csvContent += `${row.order_id},${date},"${row.product_name}",${row.quantity},${row.price_at_purchase},${row.order_status},${row.total_amount}\n`;
        });

        res.setHeader('Content-disposition', 'attachment; filename=AyurCure_Order_History.csv');
        res.setHeader('Content-type', 'text/csv');
        res.send(csvContent);
    } catch (err) {
        logger.error(`exportOrderHistory Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to export order history' });
    }
};

// ==========================================
// 3. ORDER DETAILS (:id) MODULE
// ==========================================

exports.getOrderDetails = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { id } = req.params;
        const data = await EcommerceModel.getOrderDetails(id, patientId);

        if (!data) return res.status(404).json({ error: 'Order not found' });
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getOrderDetails Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
};

exports.getOrderedProducts = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { id } = req.params;
        const data = await EcommerceModel.getOrderedProducts(id, patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getOrderedProducts Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch ordered products' });
    }
};

exports.getDeliveryStatus = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { id } = req.params;
        const data = await EcommerceModel.getDeliveryStatus(id, patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getDeliveryStatus Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch delivery status' });
    }
};

exports.getPaymentSummary = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { id } = req.params;
        const data = await EcommerceModel.getPaymentSummary(id, patientId);
        res.status(200).json(data);
    } catch (err) {
        logger.error(`getPaymentSummary Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch payment summary' });
    }
};

exports.downloadInvoice = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { id } = req.params;
        const invoiceData = await EcommerceModel.getInvoiceData(id, patientId);
        const productsData = await EcommerceModel.getOrderedProducts(id, patientId);

        if (!invoiceData) return res.status(404).json({ error: 'Invoice data not found' });

        // Generate PDF Buffer using the utility
        const pdfBuffer = await generateInvoicePdf(invoiceData, productsData);

        // Set Headers for File Download
        res.setHeader('Content-Disposition', `attachment; filename="Invoice_${invoiceData.order_id}.pdf"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Send the PDF buffer directly
        res.send(pdfBuffer);

    } catch (err) {
        logger.error(`downloadInvoice Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to download invoice' });
    }
};

exports.getOrderWellnessTip = async (req, res) => {
    try {
        // Fetch static wellness tip for post-order confirmation
        res.status(200).json({
            title: "Store Medicines Properly",
            content: "Keep your Ayurvedic medicines in a cool, dry place away from direct sunlight to maintain their efficacy."
        });
    } catch (err) {
        logger.error(`getOrderWellnessTip Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch wellness tip' });
    }
};

// ==========================================
// 4. CART & CHECKOUT MODULE
// ==========================================

exports.getCartProductDetails = async (req, res) => {
    try {
        // In a stateless backend API, cart products are usually sent from the client's local storage 
        // to be validated against the database. For this endpoint to work purely from backend, 
        // it assumes a Cart table exists. Since we rely on frontend state, we return a success 
        // acknowledgment or validate an array of IDs passed in query params.
        res.status(200).json({ message: "Cart product details are synced via frontend context." });
    } catch (err) {
        logger.error(`getCartProductDetails Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch cart product details' });
    }
};

exports.getCartOrderSummary = async (req, res) => {
    try {
        // Returns the static configuration for taxes, delivery fees etc. 
        // The frontend calculates the final subtotal based on the items in its context.
        const config = await EcommerceModel.getCartConfig();
        res.status(200).json(config);
    } catch (err) {
        logger.error(`getCartOrderSummary Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch cart summary config' });
    }
};

exports.applyPromoCode = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Promo code is required' });
        }

        const validCode = await EcommerceModel.getValidPromoCode(code.toUpperCase());

        if (!validCode) {
            return res.status(400).json({ error: 'Invalid or expired promo code' });
        }

        res.status(200).json({
            message: 'Promo code applied successfully!',
            discount: {
                value: validCode.discount_value,
                type: validCode.discount_type
            }
        });
    } catch (err) {
        logger.error(`applyPromoCode Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to apply promo code' });
    }
};

// ==========================================
// 5. PAYMENT & WEBHOOK MODULE
// ==========================================

exports.handleRazorpayWebhook = async (req, res) => {
    try {
        // Because of express.raw() in the router, req.body is a raw Buffer representing the exact payload
        const rawBody = req.body;
        const signature = req.headers['x-razorpay-signature'];

        if (!signature) {
            logger.warn('Webhook received without a signature header.');
            return res.status(400).send('Signature missing');
        }

        // Verify the event is genuinely from Razorpay
        const isValid = paymentService.verifyWebhookSignature(rawBody, signature);

        if (!isValid) {
            logger.warn('Invalid Razorpay Webhook Signature detected. Potential spoofing attempt.');
            return res.status(400).send('Invalid signature');
        }

        // Now that it is verified, parse the raw Buffer back into JSON to read the event data
        const event = JSON.parse(rawBody.toString('utf8'));
        logger.info(`Valid Webhook received: ${event.event}`);

        // Handle specific Razorpay events
        switch (event.event) {
            case 'payment.captured':
            case 'order.paid':
                const paymentEntity = event.payload.payment.entity;
                const razorpayOrderId = paymentEntity.order_id;
                const razorpayPaymentId = paymentEntity.id;

                // Use Razorpay's Order ID to find your internal order and update its status
                await EcommerceModel.updatePaymentStatusByRazorpayOrderId(
                    razorpayOrderId,
                    'Paid',
                    razorpayPaymentId
                );

                logger.info(`Order mapped to Gateway ID ${razorpayOrderId} successfully marked as Paid via Webhook.`);
                break;

            case 'payment.failed':
                const failedEntity = event.payload.payment.entity;
                logger.warn(`Payment failed for Gateway ID ${failedEntity.order_id}. Reason: ${failedEntity.error_description}`);
                // Optional: Update DB to 'Payment Failed'
                break;

            default:
                // Ignore unhandled event types silently to keep Razorpay happy
                break;
        }

        // Acknowledge receipt of the webhook to Razorpay immediately
        res.status(200).send('OK');

    } catch (err) {
        logger.error(`handleRazorpayWebhook Error: ${err.message}`);
        // Send a 500 so Razorpay knows to retry the webhook later
        res.status(500).send('Webhook Processing Error');
    }
};

exports.createOrder = async (req, res) => {
    try {
        const patientId = await getPatientId(req.user.id, res);
        if (!patientId) return;

        const { items, total_amount, shipping_address, payment_method } = req.body;

        // 1. Save the initial order to the database (Status: 'Pending')
        const internalOrderId = await EcommerceModel.createNewOrder({
            patientId,
            items,
            total_amount,
            shipping_address,
            payment_method,
            status: 'Pending'
        });

        // 2. Handle Cash on Delivery (COD)
        if (payment_method === 'Cash') {
            return res.status(200).json({
                success: true,
                message: 'Order placed successfully',
                id: internalOrderId
            });
        }

        // 3. Handle Online Payment via Razorpay
        // Your paymentService expects (amountInRupees, receiptId)
        const razorpayOrder = await paymentService.createOrder(total_amount, internalOrderId);

        // Save Razorpay order ID to internal database for webhook mapping
        await EcommerceModel.saveRazorpayOrderId(internalOrderId, razorpayOrder.id);

        // Return both internal DB ID and Razorpay Order details to frontend
        res.status(200).json({
            id: internalOrderId,
            amount: razorpayOrder.amount,
            razorpay_order_id: razorpayOrder.id,
            currency: razorpayOrder.currency
        });

    } catch (err) {
        logger.error(`createOrder Error: ${err.message}`);
        res.status(500).json({ error: 'Failed to create order' });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature, order_id } = req.body;

        // FIXED: Validate presence of gateway keys to prevent server crash during HMAC generation
        if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
            await EcommerceModel.updatePaymentStatus(order_id, 'Failed');
            return res.status(400).json({ error: 'Incomplete payment payload received.' });
        }

        const isValid = paymentService.verifyPaymentSignature(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            await EcommerceModel.updatePaymentStatus(order_id, 'Failed');
            return res.status(400).json({ error: 'Payment verification failed' });
        }

        await EcommerceModel.updatePaymentStatus(order_id, 'Paid', razorpay_payment_id);
        res.status(200).json({ success: true, message: 'Payment verified successfully' });
    } catch (err) {
        logger.error(`verifyPayment Error: ${err.message}`);
        res.status(500).json({ error: 'Internal server error during verification' });
    }
};