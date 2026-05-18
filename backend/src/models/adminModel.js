const db = require('../config/db');

const adminModel = {
    // ==========================================
    // DASHBOARD METRICS
    // ==========================================
    getTotalDoctors: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM DoctorProfiles`);
        return parseInt(rows[0].count);
    },

    getTotalPatients: async () => {
        const query = `
            SELECT COUNT(p.id) as count 
            FROM PatientProfiles p
            JOIN Users u ON p.user_id = u.id
            WHERE u.role = 'patient'
        `;
        const { rows } = await db.query(query);
        return parseInt(rows[0].count);
    },

    getTotalOrders: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM Orders`);
        return parseInt(rows[0].count);
    },

    getTotalRevenue: async () => {
        const { rows } = await db.query(`
            SELECT COALESCE(SUM(total_amount), 0) as total 
            FROM Orders WHERE payment_status = 'Paid'
        `);
        return parseFloat(rows[0].total);
    },

    // ==========================================
    // DASHBOARD RECENT LISTS
    // ==========================================
    getRecentDoctors: async () => {
        const query = `
            SELECT d.id, u.full_name as name, d.specialization, d.verification_status as status, u.created_at, d.profile_image_url as avatar 
            FROM DoctorProfiles d 
            JOIN Users u ON d.user_id = u.id 
            ORDER BY u.created_at DESC LIMIT 5
        `;
        return (await db.query(query)).rows;
    },

    getRecentPatients: async () => {
        const query = `
            SELECT p.id, u.full_name as name, p.patient_display_id, p.clinical_status as status, p.updated_at as last_visit, p.settings->>'avatar' as avatar 
            FROM PatientProfiles p 
            JOIN Users u ON p.user_id = u.id 
            WHERE u.role = 'patient'
            ORDER BY u.created_at DESC LIMIT 5
        `;
        return (await db.query(query)).rows;
    },

    getRecentOrders: async () => {
        const query = `
            SELECT o.id, o.id as order_id, u.full_name as customer, o.total_amount as amount, o.order_status as status, o.created_at as date 
            FROM Orders o 
            JOIN PatientProfiles p ON o.patient_id = p.id 
            JOIN Users u ON p.user_id = u.id 
            ORDER BY o.created_at DESC LIMIT 5
        `;
        return (await db.query(query)).rows;
    },

    // ==========================================
    // DOCTORS MANAGEMENT & ANALYTICS
    // ==========================================
    getAllDoctors: async () => {
        const query = `
            SELECT 
                d.id, 
                u.full_name as name, 
                u.email, 
                u.phone, 
                d.specialization, 
                d.verification_status as status, 
                d.average_rating as rating, 
                d.experience_years as experience, 
                d.consultation_fee, 
                d.profile_image_url as avatar
            FROM DoctorProfiles d 
            INNER JOIN Users u ON d.user_id = u.id
            ORDER BY u.created_at DESC
        `;
        return (await db.query(query)).rows;
    },

    createDoctorTransaction: async (userData, profileData) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const userQuery = `
                INSERT INTO Users (role, full_name, email, phone, password_hash, account_status) 
                VALUES ('doctor', $1, $2, $3, $4, 'Active') RETURNING id
            `;
            const userRes = await client.query(userQuery, [
                userData.full_name, userData.email, userData.phone, userData.password_hash
            ]);
            const newUserId = userRes.rows[0].id;

            const profileQuery = `
                INSERT INTO DoctorProfiles 
                (user_id, specialization, experience_years, qualifications, registration_number, consultation_fee, bio, profile_image_url, location, verification_status) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'Verified') RETURNING id
            `;
            const profileRes = await client.query(profileQuery, [
                newUserId,
                profileData.specialization,
                profileData.experience_years,
                profileData.qualifications,
                profileData.registration_number,
                profileData.consultation_fee,
                profileData.about,
                profileData.profile_image_url,
                profileData.clinic_address
            ]);

            const newDoctorId = profileRes.rows[0].id;

            const slotInsertQuery = `
                INSERT INTO DoctorSlots (doctor_id, start_time, end_time, is_booked)
                VALUES ($1, $2, $3, false)
            `;

            const startStr = profileData.startTime || '09:00';
            const endStr = profileData.endTime || '17:00';

            const [startHour, startMinute] = startStr.split(':').map(Number);
            const [endHour, endMinute] = endStr.split(':').map(Number);

            for (let i = 0; i < 14; i++) {
                const currentDay = new Date();
                currentDay.setDate(currentDay.getDate() + i);
                currentDay.setHours(0, 0, 0, 0);

                let currentTime = new Date(currentDay);
                currentTime.setHours(startHour, startMinute, 0, 0);

                const endTimeObj = new Date(currentDay);
                endTimeObj.setHours(endHour, endMinute, 0, 0);

                while (currentTime < endTimeObj) {
                    const slotStartTime = new Date(currentTime);
                    currentTime.setMinutes(currentTime.getMinutes() + 30);
                    const slotEndTime = new Date(currentTime);

                    if (slotEndTime <= endTimeObj) {
                        await client.query(slotInsertQuery, [newDoctorId, slotStartTime, slotEndTime]);
                    }
                }
            }

            await client.query('COMMIT');
            return newDoctorId;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    getPendingApprovals: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM DoctorProfiles WHERE verification_status = 'Pending'`);
        return parseInt(rows[0].count);
    },

    getVerificationRate: async () => {
        const { rows } = await db.query(`
            SELECT ROUND((COUNT(*) FILTER (WHERE verification_status = 'Verified') * 100.0) / NULLIF(COUNT(*), 0), 1) as rate 
            FROM DoctorProfiles
        `);
        return `${rows[0].rate || 0}%`;
    },

    getAverageResponseTime: async () => {
        const { rows } = await db.query(`
            SELECT COALESCE(ROUND(AVG(EXTRACT(EPOCH FROM (start_time - created_at))/3600), 1), 0) as avg_hours 
            FROM Appointments WHERE status != 'Cancelled'
        `);
        return `${rows[0].avg_hours} Hrs`;
    },

    deleteDoctor: async (doctorId) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query(`SELECT user_id FROM DoctorProfiles WHERE id = $1`, [doctorId]);

            if (rows.length > 0) {
                const userId = rows[0].user_id;

                await client.query(`
                    DELETE FROM AppointmentReviews 
                    WHERE appointment_id IN (SELECT id FROM Appointments WHERE doctor_id = $1)
                `, [doctorId]);

                await client.query(`DELETE FROM DoctorSlots WHERE doctor_id = $1`, [doctorId]);
                await client.query(`DELETE FROM Appointments WHERE doctor_id = $1`, [doctorId]);
                await client.query(`UPDATE Blogs SET author_id = NULL WHERE author_id = $1`, [userId]);
                await client.query(`DELETE FROM DoctorProfiles WHERE id = $1`, [doctorId]);
                await client.query(`DELETE FROM Users WHERE id = $1`, [userId]);
            }

            await client.query('COMMIT');
            return true;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    getDoctorDetails: async (doctorId) => {
        const query = `
            SELECT d.*, u.full_name, u.email, u.phone 
            FROM DoctorProfiles d 
            JOIN Users u ON d.user_id = u.id 
            WHERE d.id = $1
        `;
        return (await db.query(query, [doctorId])).rows[0];
    },

    updateDoctorDetails: async (doctorId, data) => {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            const { rows } = await client.query(`SELECT user_id FROM DoctorProfiles WHERE id = $1`, [doctorId]);

            if (rows.length > 0) {
                const userId = rows[0].user_id;

                let userUpdateQuery = `UPDATE Users SET full_name = COALESCE($1, full_name)`;
                let userValues = [data.full_name];

                if (data.password && data.password.trim() !== '') {
                    const bcrypt = require('bcryptjs');
                    const salt = await bcrypt.genSalt(10);
                    const hashedPw = await bcrypt.hash(data.password, salt);

                    userUpdateQuery += `, password_hash = $2 WHERE id = $3`;
                    userValues.push(hashedPw, userId);
                } else {
                    userUpdateQuery += ` WHERE id = $2`;
                    userValues.push(userId);
                }

                await client.query(userUpdateQuery, userValues);
            }

            const aboutText = data.about || data.bio;
            const addressText = data.clinical_address || data.clinic_address || data.address;

            const profileQuery = `
                UPDATE DoctorProfiles 
                SET specialization = COALESCE($1, specialization), 
                    experience_years = COALESCE($2, experience_years), 
                    consultation_fee = COALESCE($3, consultation_fee),
                    verification_status = COALESCE($4, verification_status),
                    bio = COALESCE($5, bio),
                    location = COALESCE($6, location),
                    profile_image_url = COALESCE($7, profile_image_url)
                WHERE id = $8 RETURNING id
            `;

            await client.query(profileQuery, [
                data.specialization,
                data.experience_years,
                data.consultation_fee,
                data.verification_status,
                aboutText,
                addressText,
                data.profile_image_url || data.avatar,
                doctorId
            ]);

            await client.query('COMMIT');
            return doctorId;
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    },

    // ==========================================
    // PATIENTS MANAGEMENT
    // ==========================================
    getAllPatients: async () => {
        const query = `
            SELECT p.id, p.patient_display_id, u.full_name as name, p.age, p.gender, u.phone, p.clinical_status, p.updated_at as last_visit, p.settings->>'avatar' as avatar
            FROM PatientProfiles p 
            JOIN Users u ON p.user_id = u.id
            WHERE u.role = 'patient' 
            ORDER BY u.created_at DESC
        `;
        return (await db.query(query)).rows;
    },

    getNewPatientsThisWeek: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM Users WHERE role = 'patient' AND created_at >= NOW() - INTERVAL '7 days'`);
        return parseInt(rows[0].count);
    },

    getPendingPatientReviews: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM AppointmentReviews WHERE rating <= 3 AND created_at >= NOW() - INTERVAL '7 days'`);
        return parseInt(rows[0].count);
    },

    getAveragePatientAge: async () => {
        const { rows } = await db.query(`SELECT ROUND(AVG(age), 0) as avg_age FROM PatientProfiles WHERE age IS NOT NULL`);
        return parseInt(rows[0].avg_age) || 0;
    },

    getPatientPersonalInfo: async (patientId) => {
        const query = `
            SELECT u.full_name, u.email, u.phone, p.age, p.gender, p.blood_group, p.address, p.emergency_contact_name, p.emergency_contact_phone, p.patient_display_id, p.settings->>'avatar' as avatar
            FROM PatientProfiles p 
            JOIN Users u ON p.user_id = u.id 
            WHERE p.id = $1
        `;
        return (await db.query(query, [patientId])).rows[0];
    },

    getPatientMedicalInfo: async (patientId) => {
        const query = `
            SELECT allergies, health_history as conditions, current_medications as medications, prakriti_type 
            FROM PatientProfiles 
            WHERE id = $1
        `;
        return (await db.query(query, [patientId])).rows[0];
    },

    getPatientAppointmentHistory: async (patientId) => {
        const query = `
            SELECT a.id, u.full_name as doctor_name, d.specialization, a.start_time as date, a.mode as type, a.status 
            FROM Appointments a 
            JOIN DoctorProfiles d ON a.doctor_id = d.id 
            JOIN Users u ON d.user_id = u.id 
            WHERE a.patient_id = $1 
            ORDER BY a.start_time DESC
        `;
        return (await db.query(query, [patientId])).rows;
    },

    getPatientPharmacyOrders: async (patientId) => {
        const query = `
            SELECT id as order_id, created_at as date, total_amount as amount, order_status as status 
            FROM Orders 
            WHERE patient_id = $1 
            ORDER BY created_at DESC
        `;
        return (await db.query(query, [patientId])).rows;
    },

    // ==========================================
    // ORDERS & PHARMACY ANALYTICS
    // ==========================================
    getOrdersByPagination: async (limit, offset) => {
        const query = `
            SELECT o.id as order_id, u.full_name as customer_name, o.created_at as date, o.total_amount, o.payment_status, o.order_status 
            FROM Orders o 
            JOIN PatientProfiles p ON o.patient_id = p.id 
            JOIN Users u ON p.user_id = u.id 
            ORDER BY o.created_at DESC 
            LIMIT $1 OFFSET $2
        `;
        return (await db.query(query, [limit, offset])).rows;
    },

    getTodaysRevenue: async () => {
        const { rows } = await db.query(`
            SELECT COALESCE(SUM(total_amount), 0) as total 
            FROM Orders 
            WHERE DATE(created_at) = CURRENT_DATE AND payment_status = 'Paid'
        `);
        return parseFloat(rows[0].total);
    },

    getPendingOrderTasks: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM Orders WHERE order_status IN ('Pending', 'Processing')`);
        return parseInt(rows[0].count);
    },

    getOrderGrowthRate: async () => {
        const query = `
            SELECT 
                COALESCE(
                    ROUND(
                        (
                            (SUM(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END) -
                            SUM(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END))
                            * 100.0
                        ) / NULLIF(SUM(CASE WHEN created_at >= date_trunc('month', CURRENT_DATE - INTERVAL '1 month') AND created_at < date_trunc('month', CURRENT_DATE) THEN 1 ELSE 0 END), 0),
                    1),
                0) as rate
            FROM Orders
        `;
        const { rows } = await db.query(query);
        const rate = parseFloat(rows[0].rate);
        return rate > 0 ? `+${rate}%` : `${rate}%`;
    },

    // ==========================================
    // ORDER DETAILS & DYNAMIC TIMELINE
    // ==========================================
    getOrderBasicDetails: async (orderId) => {
        const query = `SELECT id as order_number, created_at as date, order_status as status, payment_status, total_amount FROM Orders WHERE id = $1`;
        return (await db.query(query, [orderId])).rows[0];
    },

    getOrderItems: async (orderId) => {
        const query = `
            SELECT p.name as product_name, oi.quantity, oi.price_at_purchase as price 
            FROM OrderItems oi 
            JOIN Products p ON oi.product_id = p.id 
            WHERE oi.order_id = $1
        `;
        return (await db.query(query, [orderId])).rows;
    },

    getOrderCustomerDetails: async (orderId) => {
        const query = `
            SELECT u.full_name as name, u.email, u.phone, o.shipping_address 
            FROM Orders o 
            JOIN PatientProfiles p ON o.patient_id = p.id 
            JOIN Users u ON p.user_id = u.id 
            WHERE o.id = $1
        `;
        return (await db.query(query, [orderId])).rows[0];
    },

    getOrderTimeline: async (orderId) => {
        const { rows } = await db.query(`SELECT created_at, payment_status, order_status, delivery_eta FROM Orders WHERE id = $1`, [orderId]);
        if (!rows.length) return [];
        const order = rows[0];

        const timeline = [];
        timeline.push({ status: "Order Placed", date: order.created_at });

        if (order.payment_status === 'Paid') {
            timeline.push({ status: "Payment Confirmed", date: order.created_at });
        }
        if (['Processing', 'Shipped', 'Delivered'].includes(order.order_status)) {
            timeline.push({ status: "Processing Started", date: order.created_at });
        }
        if (['Shipped', 'Delivered'].includes(order.order_status)) {
            timeline.push({ status: "Shipped", date: order.delivery_eta || order.created_at });
        }
        if (order.order_status === 'Delivered') {
            timeline.push({ status: "Delivered", date: order.delivery_eta || new Date() });
        }
        return timeline;
    },

    getOrderPaymentSummary: async (orderId) => {
        const query = `SELECT payment_method as method, total_amount as total, discount_applied as discount FROM Orders WHERE id = $1`;
        const { rows } = await db.query(query, [orderId]);
        if (!rows.length) return null;
        return {
            method: rows[0].method || 'Online',
            subtotal: parseFloat(rows[0].total) + parseFloat(rows[0].discount),
            discount: parseFloat(rows[0].discount),
            shipping: 0,
            total: parseFloat(rows[0].total)
        };
    },

    // ==========================================
    // INVENTORY DYNAMIC FILTERING
    // ==========================================
    addNewProduct: async (data) => {
        const query = `
        INSERT INTO Products (name, category, brand, price, stock_quantity, ingredients, benefits, usage_instructions, image_url) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
    `;
        const { rows } = await db.query(query, [
            data.name,
            data.category,
            data.brand || 'Ayurcure',
            data.price || 0,
            data.stock_quantity || 0,
            data.ingredients || null,
            data.benefits || null,
            data.usage_instructions || null,
            data.image_url || null
        ]);
        return rows[0].id;
    },

    getAllProductsPagination: async (limit, offset) => {
        const query = `
            SELECT id, name, category, stock_quantity as stock, price, image_url, 
            CASE WHEN stock_quantity > 10 THEN 'In Stock' WHEN stock_quantity > 0 THEN 'Low Stock' ELSE 'Out of Stock' END as status 
            FROM Products 
            ORDER BY id DESC 
            LIMIT $1 OFFSET $2
        `;
        const { rows: products } = await db.query(query, [limit, offset]);

        const countQuery = `SELECT COUNT(*) FROM Products`;
        const { rows: countRows } = await db.query(countQuery);
        const totalCount = parseInt(countRows[0].count, 10);

        return { products, totalCount };
    },

    filterInventory: async (filters) => {
        let query = `
            SELECT id, name, category, stock_quantity as stock, price, 
            CASE WHEN stock_quantity > 10 THEN 'In Stock' WHEN stock_quantity > 0 THEN 'Low Stock' ELSE 'Out of Stock' END as status 
            FROM Products WHERE 1=1
        `;
        const values = [];

        if (filters.category && filters.category !== 'All Categories') {
            values.push(filters.category);
            query += ` AND category = $${values.length}`;
        }
        if (filters.status && filters.status !== 'All Status') {
            if (filters.status === 'In Stock') query += ` AND stock_quantity > 10`;
            if (filters.status === 'Low Stock') query += ` AND stock_quantity > 0 AND stock_quantity <= 10`;
            if (filters.status === 'Out of Stock') query += ` AND stock_quantity = 0`;
        }
        if (filters.search) {
            values.push(`%${filters.search}%`);
            query += ` AND name ILIKE $${values.length}`;
        }

        query += ` ORDER BY id DESC`;
        return (await db.query(query, values)).rows;
    },

    getAllCategories: async () => {
        const { rows } = await db.query(`SELECT DISTINCT category FROM Products WHERE category IS NOT NULL`);
        return rows.map(r => r.category);
    },

    getProductDetails: async (productId) => {
        const query = `SELECT * FROM Products WHERE id = $1`;
        return (await db.query(query, [productId])).rows[0];
    },

    updateProduct: async (productId, data) => {
        const query = `
            UPDATE Products 
            SET name = COALESCE($1, name), 
                category = COALESCE($2, category), 
                price = COALESCE($3, price), 
                stock_quantity = COALESCE($4, stock_quantity)
            WHERE id = $5 RETURNING id
        `;
        const { rows } = await db.query(query, [data.name, data.category, data.price, data.stock_quantity, productId]);
        return rows[0];
    },

    deleteProduct: async (productId) => {
        const query = `DELETE FROM Products WHERE id = $1 RETURNING id`;
        const { rows } = await db.query(query, [productId]);
        return rows[0];
    },

    // ==========================================
    // BLOGS
    // ==========================================
    getAllBlogs: async () => {
        const query = `
            SELECT b.id, b.title, u.full_name as author, b.category, b.views, b.status, b.created_at as date 
            FROM Blogs b 
            LEFT JOIN Users u ON b.author_id = u.id 
            ORDER BY b.created_at DESC
        `;
        return (await db.query(query)).rows;
    },

    addNewBlog: async (blogData, authorId) => {
        const query = `
            INSERT INTO Blogs (title, content, category, author_id, status) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        `;
        const { rows } = await db.query(query, [blogData.title, blogData.content, blogData.category, authorId, blogData.status || 'Published']);
        return rows[0].id;
    },

    updateBlog: async (blogId, data) => {
        const query = `
            UPDATE Blogs 
            SET title = COALESCE($1, title), 
                content = COALESCE($2, content), 
                category = COALESCE($3, category), 
                status = COALESCE($4, status)
            WHERE id = $5 RETURNING id
        `;
        const { rows } = await db.query(query, [data.title, data.content, data.category, data.status, blogId]);
        return rows[0];
    },

    updateBlogStatus: async (blogId, status) => {
        const { rows } = await db.query(`UPDATE Blogs SET status = $1 WHERE id = $2 RETURNING id`, [status, blogId]);
        return rows[0];
    },

    deleteBlog: async (blogId) => {
        const { rows } = await db.query(`DELETE FROM Blogs WHERE id = $1 RETURNING id`, [blogId]);
        return rows[0];
    },

    getBlogMetrics: async () => {
        const trending = await db.query(`SELECT category FROM Blogs GROUP BY category ORDER BY SUM(views) DESC LIMIT 1`);
        const reviews = await db.query(`SELECT COUNT(*) as count FROM Blogs WHERE status = 'Draft'`);
        const traffic = await db.query(`SELECT COALESCE(SUM(views), 0) as views FROM Blogs`);

        return {
            trendingCategory: trending.rows[0]?.category || 'N/A',
            reviewRequired: parseInt(reviews.rows[0]?.count || 0),
            totalTraffic: parseInt(traffic.rows[0]?.views || 0)
        };
    },

    getBlogDetails: async (blogId) => {
        const query = `SELECT * FROM Blogs WHERE id = $1`;
        return (await db.query(query, [blogId])).rows[0];
    },

    // ==========================================
    // COMPLEX REPORTS & CHARTS DATA
    // ==========================================
    getOverallReportDetails: async () => {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM Orders) as total_orders,
                (SELECT COALESCE(SUM(total_amount), 0) FROM Orders WHERE payment_status = 'Paid') as total_revenue,
                (SELECT COUNT(p.id) FROM PatientProfiles p JOIN Users u ON p.user_id = u.id WHERE u.role = 'patient') as total_patients,
                (SELECT COUNT(*) FROM DoctorProfiles) as total_doctors
        `;
        return (await db.query(query)).rows[0];
    },

    getLast30DaysDetails: async () => {
        const query = `
            SELECT 
                (SELECT COUNT(*) FROM Orders WHERE created_at >= NOW() - INTERVAL '30 days') as total_orders,
                (SELECT COALESCE(SUM(total_amount), 0) FROM Orders WHERE payment_status = 'Paid' AND created_at >= NOW() - INTERVAL '30 days') as total_revenue,
                (SELECT COUNT(p.id) FROM PatientProfiles p JOIN Users u ON p.user_id = u.id WHERE u.role = 'patient' AND p.updated_at >= NOW() - INTERVAL '30 days') as total_patients,
                (SELECT COUNT(*) FROM Appointments WHERE start_time >= NOW() - INTERVAL '30 days' AND status = 'Completed') as total_consultations
        `;
        return (await db.query(query)).rows[0];
    },

    getOrderTrend: async () => {
        const query = `
            SELECT TO_CHAR(DATE(created_at), 'Mon DD') as date, COUNT(*) as orders 
            FROM Orders 
            WHERE created_at >= NOW() - INTERVAL '30 days' 
            GROUP BY DATE(created_at) 
            ORDER BY DATE(created_at) ASC
        `;
        return (await db.query(query)).rows;
    },

    getRevenueGrowth: async () => {
        const query = `
            SELECT TO_CHAR(DATE_TRUNC('month', created_at), 'Mon') as month, COALESCE(SUM(total_amount), 0) as revenue
            FROM Orders
            WHERE payment_status = 'Paid' AND created_at >= NOW() - INTERVAL '6 months'
            GROUP BY DATE_TRUNC('month', created_at)
            ORDER BY DATE_TRUNC('month', created_at) ASC
        `;
        return (await db.query(query)).rows;
    },

    getRevenueStreamAnalysis: async () => {
        const query = `
            SELECT 'Pharmacy Orders' as stream, COALESCE(SUM(total_amount), 0) as value 
            FROM Orders WHERE payment_status = 'Paid'
            UNION ALL
            SELECT 'Consultations' as stream, COALESCE(SUM(dp.consultation_fee), 0) as value 
            FROM Appointments a JOIN DoctorProfiles dp ON a.doctor_id = dp.id WHERE a.status = 'Completed'
        `;
        return (await db.query(query)).rows;
    },

    getTopPerformingProducts: async () => {
        const query = `
            SELECT p.name, SUM(oi.quantity) as total_sold, SUM(oi.quantity * oi.price_at_purchase) as revenue
            FROM OrderItems oi
            JOIN Products p ON oi.product_id = p.id
            JOIN Orders o ON oi.order_id = o.id
            WHERE o.payment_status = 'Paid'
            GROUP BY p.id, p.name
            ORDER BY total_sold DESC
            LIMIT 5
        `;
        return (await db.query(query)).rows;
    },

    getTopConsultations: async () => {
        const query = `
            SELECT d.specialization as name, COUNT(a.id) as value
            FROM Appointments a
            JOIN DoctorProfiles d ON a.doctor_id = d.id
            GROUP BY d.specialization
            ORDER BY value DESC
            LIMIT 5
        `;
        return (await db.query(query)).rows;
    },

    // ==========================================
    // SETTINGS & ADMIN USERS
    // ==========================================
    getSecurityScore: async () => {
        const { rows } = await db.query(`
            SELECT ROUND((COUNT(*) FILTER(WHERE account_status = 'Active') * 100.0) / NULLIF(COUNT(*), 0), 0) as score 
            FROM Users
        `);
        return `${rows[0].score || 90}/100`;
    },

    getActiveSessions: async () => {
        const { rows } = await db.query(`SELECT COUNT(*) as count FROM Users WHERE created_at >= NOW() - INTERVAL '1 day'`);
        return parseInt(rows[0].count);
    },

    addAdmin: async (data) => {
        const query = `
            INSERT INTO Users (role, full_name, email, phone, password_hash, account_status, created_at) 
            VALUES ('admin', $1, $2, $3, $4, 'Active', NOW()) RETURNING id
        `;
        const { rows } = await db.query(query, [data.full_name, data.email, data.phone, data.password_hash]);
        return rows[0].id;
    },

    getAllAdmins: async () => {
        const query = `
            SELECT id, full_name as name, role, email, account_status as status, created_at 
            FROM Users 
            WHERE role = 'admin' 
            ORDER BY created_at DESC NULLS LAST
        `;
        return (await db.query(query)).rows;
    },

    updateAdminDetails: async (adminId, data) => {
        const query = `
            UPDATE Users 
            SET full_name = COALESCE($1, full_name), 
                email = COALESCE($2, email), 
                phone = COALESCE($3, phone),
                account_status = COALESCE($4, account_status)
            WHERE id = $5 AND role = 'admin' RETURNING id
        `;
        const { rows } = await db.query(query, [data.full_name, data.email, data.phone, data.account_status, adminId]);
        return rows[0];
    },

    getAdminDetails: async (adminId) => {
        const query = `SELECT id, full_name, email, phone, role, account_status FROM Users WHERE id = $1`;
        return (await db.query(query, [adminId])).rows[0];
    }
};

module.exports = adminModel;