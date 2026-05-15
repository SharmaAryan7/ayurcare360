const adminModel = require('../models/adminModel');
const bcrypt = require('bcryptjs');

// ==========================================
// DASHBOARD
// ==========================================
exports.getTotalDoctors = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getTotalDoctors() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTotalPatients = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getTotalPatients() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTotalOrders = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getTotalOrders() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTotalRevenue = async (req, res) => {
    try { res.status(200).json({ success: true, revenue: await adminModel.getTotalRevenue() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getRecentDoctors = async (req, res) => {
    try { res.status(200).json({ success: true, doctors: await adminModel.getRecentDoctors() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getRecentPatients = async (req, res) => {
    try { res.status(200).json({ success: true, patients: await adminModel.getRecentPatients() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getRecentOrders = async (req, res) => {
    try { res.status(200).json({ success: true, orders: await adminModel.getRecentOrders() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// DOCTORS
// ==========================================
exports.getAllDoctors = async (req, res) => {
    try { res.status(200).json({ success: true, doctors: await adminModel.getAllDoctors() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.addDoctor = async (req, res) => {
    try {
        const { full_name, email, phone, password, specialization, experience_years, qualifications, registration_number, consultation_fee, about } = req.body;
        let profile_image_url = null;
        if (req.file) {
            profile_image_url = req.file.s3Url || `/uploads/${req.file.filename}`;
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password || 'Ayurcure@Doc123', salt);

        const doctorId = await adminModel.createDoctorTransaction(
            { full_name, email, phone, password_hash },
            { specialization, experience_years, qualifications, registration_number, consultation_fee, about, profile_image_url }
        );

        res.status(201).json({ success: true, message: "Doctor onboarded successfully", doctorId });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'Email or Phone already exists.' });
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteDoctor = async (req, res) => {
    try {
        await adminModel.deleteDoctor(req.params.id);
        res.status(200).json({ success: true, message: 'Doctor deleted successfully' });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getVerificationRate = async (req, res) => {
    try { res.status(200).json({ success: true, rate: await adminModel.getVerificationRate() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAverageResponseTime = async (req, res) => {
    try { res.status(200).json({ success: true, time: await adminModel.getAverageResponseTime() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getPendingApprovals = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getPendingApprovals() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateDoctorDetails = async (req, res) => {
    try {
        const data = req.body;

        // 🚨 THE FIX: Capture the AWS S3 URL and map it to the correct schema column!
        if (req.file) {
            data.profile_image_url = req.file.s3Url || `/uploads/${req.file.filename}`;
        }

        await adminModel.updateDoctorDetails(req.params.id, data);
        res.status(200).json({ success: true, message: "Doctor updated successfully" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getDoctorDetails = async (req, res) => {
    try { res.status(200).json({ success: true, data: await adminModel.getDoctorDetails(req.params.id) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// PATIENTS
// ==========================================
exports.getAllPatients = async (req, res) => {
    try { res.status(200).json({ success: true, patients: await adminModel.getAllPatients() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getNewPatientsThisWeek = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getNewPatientsThisWeek() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getPendingPatientReviews = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getPendingPatientReviews() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAveragePatientAge = async (req, res) => {
    try { res.status(200).json({ success: true, age: await adminModel.getAveragePatientAge() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// PATIENT DETAILS
// ==========================================
exports.getPatientPersonalInfo = async (req, res) => {
    try { res.status(200).json({ success: true, ...(await adminModel.getPatientPersonalInfo(req.params.id)) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getPatientMedicalInfo = async (req, res) => {
    try { res.status(200).json({ success: true, ...(await adminModel.getPatientMedicalInfo(req.params.id)) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getPatientAppointmentHistory = async (req, res) => {
    try { res.status(200).json({ success: true, history: await adminModel.getPatientAppointmentHistory(req.params.id) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getPatientPharmacyOrders = async (req, res) => {
    try { res.status(200).json({ success: true, orders: await adminModel.getPatientPharmacyOrders(req.params.id) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// ORDERS
// ==========================================
exports.getOrdersByPagination = async (req, res) => {
    try {
        const page = parseInt(req.params.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;
        res.status(200).json({ success: true, orders: await adminModel.getOrdersByPagination(limit, offset) });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTodaysRevenue = async (req, res) => {
    try { res.status(200).json({ success: true, revenue: await adminModel.getTodaysRevenue() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getPendingOrderTasks = async (req, res) => {
    try { res.status(200).json({ success: true, count: await adminModel.getPendingOrderTasks() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderGrowthRate = async (req, res) => {
    try { res.status(200).json({ success: true, rate: await adminModel.getOrderGrowthRate() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// ORDER DETAILS
// ==========================================
exports.printInvoice = async (req, res) => {
    try {
        const orderData = await adminModel.getOrderBasicDetails(req.params.id);
        res.setHeader('Content-disposition', `attachment; filename=Invoice_${req.params.id}.pdf`);
        res.setHeader('Content-type', 'application/pdf');
        res.status(200).send("PDF Binary Stream - Integrates with PDFKit based on " + JSON.stringify(orderData));
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderBasicDetails = async (req, res) => {
    try { res.status(200).json({ success: true, ...(await adminModel.getOrderBasicDetails(req.params.id)) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderItems = async (req, res) => {
    try { res.status(200).json({ success: true, items: await adminModel.getOrderItems(req.params.id) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderCustomerDetails = async (req, res) => {
    try { res.status(200).json({ success: true, ...(await adminModel.getOrderCustomerDetails(req.params.id)) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderTimeline = async (req, res) => {
    try { res.status(200).json({ success: true, timeline: await adminModel.getOrderTimeline(req.params.id) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderPaymentSummary = async (req, res) => {
    try { res.status(200).json({ success: true, summary: await adminModel.getOrderPaymentSummary(req.params.id) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// INVENTORY
// ==========================================
exports.addNewProduct = async (req, res) => {
    try {
        const productData = { ...req.body };

        if (req.file) {
            productData.image_url = req.file.s3Url || `/uploads/${req.file.filename}`;
        }

        productData.price = parseFloat(productData.price) || 0;
        productData.stock_quantity = parseInt(productData.stock_quantity, 10) || 0;

        const productId = await adminModel.addNewProduct(productData);
        res.status(201).json({ success: true, message: "Product added successfully", productId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllProductsPagination = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || parseInt(req.params.page) || 1;
        const limit = 10;
        const offset = (page - 1) * limit;

        const data = await adminModel.getAllProductsPagination(limit, offset);

        const totalPages = Math.ceil(data.totalCount / limit);

        res.status(200).json({
            success: true,
            products: data.products,
            pagination: {
                currentPage: page,
                totalPages: totalPages,
                totalItems: data.totalCount
            }
        });
    } catch (error) {
        console.error("🚨 PAGINATION ERROR:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.filterInventory = async (req, res) => {
    try { res.status(200).json({ success: true, products: await adminModel.filterInventory(req.body) }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllCategories = async (req, res) => {
    try { res.status(200).json({ success: true, categories: await adminModel.getAllCategories() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getProductDetails = async (req, res) => {
    try {
        const data = await adminModel.getProductDetails(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.updateProduct = async (req, res) => {
    try {
        const productData = req.body;

        if (req.file) {
            productData.image_url = req.file.s3Url || `/uploads/${req.file.filename}`;
        }

        await adminModel.updateProduct(req.params.id, productData);
        res.status(200).json({ success: true, message: "Product updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        await adminModel.deleteProduct(req.params.id);
        res.status(200).json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// ==========================================
// BLOGS
// ==========================================
exports.getAllBlogs = async (req, res) => {
    try { res.status(200).json({ success: true, blogs: await adminModel.getAllBlogs() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.addNewBlog = async (req, res) => {
    try {
        if (req.file && req.file.s3Url) {
            req.body.image_url = req.file.s3Url;
        }

        const blogId = await adminModel.addNewBlog(req.body, req.user.id);
        res.status(201).json({ success: true, message: "Blog published successfully", blogId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        if (req.file && req.file.s3Url) {
            req.body.image_url = req.file.s3Url;
        }

        await adminModel.updateBlog(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Blog updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        await adminModel.deleteBlog(req.params.id);
        res.status(200).json({ success: true, message: "Blog deleted successfully" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTrendingCategory = async (req, res) => {
    try {
        const metrics = await adminModel.getBlogMetrics();
        res.status(200).json({ success: true, category: metrics.trendingCategory });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getBlogsReviewRequired = async (req, res) => {
    try {
        const metrics = await adminModel.getBlogMetrics();
        res.status(200).json({ success: true, count: metrics.reviewRequired });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getBlogTraffic = async (req, res) => {
    try {
        const metrics = await adminModel.getBlogMetrics();
        res.status(200).json({ success: true, traffic: metrics.totalTraffic });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.saveBlogAsDraft = async (req, res) => {
    try {
        await adminModel.updateBlogStatus(req.params.id, 'Draft');
        res.status(200).json({ success: true, message: "Blog saved as draft" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getBlogDetails = async (req, res) => {
    try {
        const data = await adminModel.getBlogDetails(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.status(200).json({ success: true, admins });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getAdminDetails = async (req, res) => {
    try {
        const data = await adminModel.getAdminDetails(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// REPORTS
// ==========================================
exports.exportReportsPdf = async (req, res) => {
    try {
        const reportData = await adminModel.getOverallReportDetails();
        res.setHeader('Content-disposition', 'attachment; filename=Ayurcure_Platform_Report.pdf');
        res.setHeader('Content-type', 'application/pdf');
        res.status(200).send("PDF Binary Stream based on dynamic data: " + JSON.stringify(reportData));
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOverallReportDetails = async (req, res) => {
    try { res.status(200).json({ success: true, data: await adminModel.getOverallReportDetails() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getLast30DaysDetails = async (req, res) => {
    try { res.status(200).json({ success: true, data: await adminModel.getLast30DaysDetails() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getOrderTrend = async (req, res) => {
    try { res.status(200).json({ success: true, trend: await adminModel.getOrderTrend() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getRevenueGrowth = async (req, res) => {
    try { res.status(200).json({ success: true, growth: await adminModel.getRevenueGrowth() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getRevenueStreamAnalysis = async (req, res) => {
    try { res.status(200).json({ success: true, stream: await adminModel.getRevenueStreamAnalysis() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTopPerformingProducts = async (req, res) => {
    try { res.status(200).json({ success: true, products: await adminModel.getTopPerformingProducts() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getTopConsultations = async (req, res) => {
    try { res.status(200).json({ success: true, consultations: await adminModel.getTopConsultations() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

// ==========================================
// SETTINGS
// ==========================================
exports.getSettingsTotalRevenue = async (req, res) => {
    try { res.status(200).json({ success: true, revenue: await adminModel.getTotalRevenue() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getSecurityScore = async (req, res) => {
    try { res.status(200).json({ success: true, score: await adminModel.getSecurityScore() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.getActiveSessions = async (req, res) => {
    try { res.status(200).json({ success: true, sessions: await adminModel.getActiveSessions() }); }
    catch (error) { res.status(500).json({ success: false, message: error.message }); }
};

exports.addAdmin = async (req, res) => {
    try {
        const { full_name, email, phone, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password || 'Admin@123', salt);

        const adminId = await adminModel.addAdmin({ full_name, email, phone, password_hash });
        res.status(201).json({ success: true, message: "Admin added successfully", adminId });
    } catch (error) {
        if (error.code === '23505') return res.status(409).json({ success: false, message: 'Email already exists.' });
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllAdmins = async (req, res) => {
    try {
        const admins = await adminModel.getAllAdmins();
        res.status(200).json({ success: true, admins });
    } catch (error) {
        console.error("Error in getAllAdmins:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAdminDetails = async (req, res) => {
    try {
        const data = await adminModel.getAdminDetails(req.params.id);
        res.status(200).json({ success: true, data });
    } catch (error) {
        console.error("Error in getAdminDetails:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAdminDetails = async (req, res) => {
    try {
        await adminModel.updateAdminDetails(req.params.id, req.body);
        res.status(200).json({ success: true, message: "Admin updated successfully" });
    } catch (error) { res.status(500).json({ success: false, message: error.message }); }
};