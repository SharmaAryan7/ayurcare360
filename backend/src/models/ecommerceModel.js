const db = require('../config/db');

class EcommerceModel {
    // ==========================================
    // 1. PHARMACY STORE MODULE
    // ==========================================

    static async getAllProducts() {
        const query = `
            SELECT id, name, category, brand, price, stock_quantity, image_url 
            FROM Products 
            WHERE stock_quantity > 0 
            ORDER BY name ASC;
        `;
        const { rows } = await db.query(query);
        return rows;
    }

    static async getProductsByCategory(categoryName) {
        const query = `
            SELECT id, name, category, brand, price, stock_quantity, image_url
            FROM Products 
            WHERE category ILIKE $1 AND stock_quantity > 0 
            ORDER BY name ASC;
        `;
        const { rows } = await db.query(query, [`%${categoryName}%`]);
        return rows;
    }

    static async getProductDetails(productId) {
        const query = `
            SELECT 
                id, name, category, brand, ingredients, benefits, 
                usage_instructions, certifications, prakriti_suitability, 
                price, stock_quantity, image_url
            FROM Products 
            WHERE id = $1;
        `;
        const { rows } = await db.query(query, [productId]);
        return rows[0];
    }

    // ==========================================
    // 2. PHARMACY ORDERS (METRICS & HISTORY)
    // ==========================================

    static async getInProgressOrdersCount(patientId) {
        const query = `
            SELECT COUNT(id) AS in_progress_count 
            FROM Orders 
            WHERE patient_id = $1 AND order_status IN ('Pending', 'Processing', 'Shipped');
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async getShippedTodayCount(patientId) {
        const query = `
            SELECT COUNT(id) AS shipped_today_count 
            FROM Orders 
            WHERE patient_id = $1 
              AND order_status = 'Shipped' 
              AND DATE(created_at) = CURRENT_DATE;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async getTotalSpent(patientId) {
        const query = `
            SELECT COALESCE(SUM(total_amount), 0.00) AS total_spent 
            FROM Orders 
            WHERE patient_id = $1 AND payment_status = 'Paid';
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows[0];
    }

    static async getOrderHistory(patientId) {
        const query = `
            SELECT 
                o.id AS order_id, o.created_at, o.total_amount, o.order_status, 
                COUNT(oi.id) AS total_items
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.id = oi.order_id
            WHERE o.patient_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async filterOrderHistory(patientId, status, sortBy) {
        let query = `
            SELECT 
                o.id AS order_id, o.created_at, o.total_amount, o.order_status, 
                COUNT(oi.id) AS total_items
            FROM Orders o
            LEFT JOIN OrderItems oi ON o.id = oi.order_id
            WHERE o.patient_id = $1
        `;
        const params = [patientId];
        let pIndex = 2;

        if (status && status !== 'undefined' && status !== 'All') {
            query += ` AND o.order_status ILIKE $${pIndex++}`;
            params.push(`%${status}%`);
        }

        query += ` GROUP BY o.id`;

        if (sortBy === 'Amount High to Low') query += ` ORDER BY o.total_amount DESC;`;
        else if (sortBy === 'Amount Low to High') query += ` ORDER BY o.total_amount ASC;`;
        else if (sortBy === 'Oldest First') query += ` ORDER BY o.created_at ASC;`;
        else query += ` ORDER BY o.created_at DESC;`; // Default 'Recent First'

        const { rows } = await db.query(query, params);
        return rows;
    }

    static async getRefillReminder(patientId) {
        // Fetches items ordered more than 20 days ago to suggest a refill
        const query = `
            SELECT DISTINCT
                p.id AS product_id, p.name, p.price, o.created_at AS last_ordered_date
            FROM OrderItems oi
            JOIN Orders o ON oi.order_id = o.id
            JOIN Products p ON oi.product_id = p.id
            WHERE o.patient_id = $1 
              AND o.created_at < CURRENT_DATE - INTERVAL '20 days'
            ORDER BY o.created_at DESC 
            LIMIT 4;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    static async exportOrderHistory(patientId) {
        const query = `
            SELECT 
                o.id AS order_id, o.created_at, o.order_status, o.payment_status,
                o.total_amount, o.discount_applied, o.shipping_address,
                p.name AS product_name, oi.quantity, oi.price_at_purchase
            FROM Orders o
            JOIN OrderItems oi ON o.id = oi.order_id
            JOIN Products p ON oi.product_id = p.id
            WHERE o.patient_id = $1
            ORDER BY o.created_at DESC;
        `;
        const { rows } = await db.query(query, [patientId]);
        return rows;
    }

    // ==========================================
    // 3. SPECIFIC ORDER DETAILS (:id)
    // ==========================================

    static async getOrderDetails(orderId, patientId) {
        const query = `
            SELECT id AS order_id, created_at, shipping_address, order_status, delivery_eta 
            FROM Orders 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [orderId, patientId]);
        return rows[0];
    }

    static async getOrderedProducts(orderId, patientId) {
        const query = `
            SELECT 
                p.id AS product_id, p.name, p.brand, 
                oi.quantity, oi.price_at_purchase, 
                (oi.quantity * oi.price_at_purchase) AS subtotal
            FROM OrderItems oi
            JOIN Products p ON oi.product_id = p.id
            JOIN Orders o ON oi.order_id = o.id
            WHERE oi.order_id = $1 AND o.patient_id = $2;
        `;
        const { rows } = await db.query(query, [orderId, patientId]);
        return rows;
    }

    static async getDeliveryStatus(orderId, patientId) {
        const query = `
            SELECT order_status, created_at AS order_placed_date, delivery_eta 
            FROM Orders 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [orderId, patientId]);
        return rows[0];
    }

    static async getPaymentSummary(orderId, patientId) {
        const query = `
            SELECT payment_method, payment_status, total_amount, discount_applied 
            FROM Orders 
            WHERE id = $1 AND patient_id = $2;
        `;
        const { rows } = await db.query(query, [orderId, patientId]);
        return rows[0];
    }

    static async getInvoiceData(orderId, patientId) {
        // Collects everything needed to generate a comprehensive PDF invoice
        const query = `
            SELECT 
                o.id AS order_id, o.created_at, o.payment_method, o.payment_status,
                o.total_amount, o.discount_applied, o.shipping_address,
                u.full_name AS patient_name, u.email AS patient_email
            FROM Orders o
            JOIN PatientProfiles pp ON o.patient_id = pp.id
            JOIN Users u ON pp.user_id = u.id
            WHERE o.id = $1 AND o.patient_id = $2;
        `;
        const { rows } = await db.query(query, [orderId, patientId]);
        return rows[0];
    }

    // ==========================================
    // 4. CART & PROMO CODE MODULE
    // ==========================================

    static async getValidPromoCode(code) {
        const query = `
            SELECT code, discount_value, discount_type 
            FROM Coupons 
            WHERE code = $1 AND expiry_date > CURRENT_TIMESTAMP;
        `;
        const { rows } = await db.query(query, [code]);
        return rows[0];
    }

    // Assuming cart persistence lives in frontend, backend provides default summary config
    static async getCartConfig() {
        return {
            delivery_fee: 40.00, // E.g., Rs. 40 standard delivery
            free_delivery_threshold: 500.00,
            estimated_tax_percentage: 18.00
        };
    }

    // ==========================================
    // 5. CHECKOUT & PAYMENT LIFECYCLE
    // ==========================================

    static async createNewOrder(orderData) {
        const { patientId, items, total_amount, shipping_address, payment_method, status } = orderData;
        const client = await db.connect(); // Use a dedicated client for transaction

        try {
            await client.query('BEGIN');

            // 1. Insert the main order
            const orderQuery = `
                INSERT INTO Orders (patient_id, total_amount, shipping_address, payment_method, order_status, payment_status)
                VALUES ($1, $2, $3, $4, $5, 'Pending')
                RETURNING id;
            `;
            const orderRes = await client.query(orderQuery, [
                patientId, total_amount, shipping_address, payment_method, status
            ]);
            const orderId = orderRes.rows[0].id;

            // 2. Insert all cart items associated with this order
            for (let item of items) {
                const itemQuery = `
                    INSERT INTO OrderItems (order_id, product_id, quantity, price_at_purchase)
                    VALUES ($1, $2, $3, $4);
                `;
                await client.query(itemQuery, [orderId, item.product_id, item.quantity, item.price]);
            }

            await client.query('COMMIT');
            return orderId;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async saveRazorpayOrderId(internalOrderId, razorpayOrderId) {
        const query = `
            UPDATE Orders 
            SET razorpay_order_id = $1 
            WHERE id = $2;
        `;
        await db.query(query, [razorpayOrderId, internalOrderId]);
    }

    static async updatePaymentStatus(internalOrderId, status, razorpayPaymentId = null) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // 1. Update the main Orders table
            const updateQuery = `
                UPDATE Orders 
                SET payment_status = $1, razorpay_payment_id = $2
                WHERE id = $3
                RETURNING id, patient_id, razorpay_order_id, total_amount;
            `;
            const orderRes = await client.query(updateQuery, [status, razorpayPaymentId, internalOrderId]);

            // 2. Log the payment event into the dedicated PaymentHistory table
            if (orderRes.rows.length > 0) {
                const order = orderRes.rows[0];
                const insertHistoryQuery = `
                    INSERT INTO PaymentHistory (order_id, patient_id, razorpay_order_id, razorpay_payment_id, amount, status)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `;
                await client.query(insertHistoryQuery, [
                    order.id,
                    order.patient_id,
                    order.razorpay_order_id,
                    razorpayPaymentId,
                    order.total_amount,
                    status
                ]);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    static async updatePaymentStatusByRazorpayOrderId(razorpayOrderId, status, razorpayPaymentId = null) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // 1. Update the main Orders table
            const updateQuery = `
                UPDATE Orders 
                SET payment_status = $1, razorpay_payment_id = $2
                WHERE razorpay_order_id = $3
                RETURNING id, patient_id, razorpay_order_id, total_amount;
            `;
            const orderRes = await client.query(updateQuery, [status, razorpayPaymentId, razorpayOrderId]);

            // 2. Log the payment event into the dedicated PaymentHistory table
            if (orderRes.rows.length > 0) {
                const order = orderRes.rows[0];
                const insertHistoryQuery = `
                    INSERT INTO PaymentHistory (order_id, patient_id, razorpay_order_id, razorpay_payment_id, amount, status)
                    VALUES ($1, $2, $3, $4, $5, $6);
                `;
                await client.query(insertHistoryQuery, [
                    order.id,
                    order.patient_id,
                    order.razorpay_order_id,
                    razorpayPaymentId,
                    order.total_amount,
                    status
                ]);
            }

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = EcommerceModel;