const PDFDocument = require('pdfkit');
const logger = require('./logger');

/**
 * Generates a PDF buffer for a clinical prescription.
 * @param {Object} prescriptionData - Contains patient, doctor, and medication details mapped from the database.
 * @returns {Promise<Buffer>} - Resolves with the binary PDF data.
 */
const generatePrescriptionPdf = (prescriptionData) => {
    return new Promise((resolve, reject) => {
        try {
            // Initialize document with standard margins
            const doc = new PDFDocument({ margin: 50 });
            const buffers = [];

            // Capture data chunks in memory rather than writing to disk
            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                const pdfData = Buffer.concat(buffers);
                resolve(pdfData);
            });

            // 1. Document Header
            doc.fontSize(20).text('AyurCure Clinic', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Doctor: ${prescriptionData.doctorName}`);
            doc.text(`Patient: ${prescriptionData.patientName}`);
            doc.text(`Date: ${new Date(prescriptionData.date).toLocaleDateString()}`);
            doc.moveDown();

            // Separator Line
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();

            // 2. Clinical Data (Mapped to PostgreSQL 'Appointments' and 'Prescriptions' tables)
            doc.fontSize(14).text('Chief Complaint:', { underline: true });
            doc.fontSize(12).text(prescriptionData.chiefComplaint || 'N/A');
            doc.moveDown();

            doc.fontSize(14).text('Prescribed Herbs/Medicines:', { underline: true });
            doc.fontSize(12).text(prescriptionData.herbsPrescribed || 'N/A');
            doc.moveDown();

            doc.fontSize(14).text('Dosage & Duration:', { underline: true });
            doc.fontSize(12).text(`Dosage: ${prescriptionData.dosage || 'N/A'}`);
            doc.text(`Duration: ${prescriptionData.duration || 'N/A'}`);
            doc.moveDown();

            doc.fontSize(14).text('Lifestyle Advice:', { underline: true });
            doc.fontSize(12).text(prescriptionData.lifestyleAdvice || 'N/A');

            // 3. Document Footer
            doc.moveDown(3);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown();
            doc.fontSize(10).text('This is a digitally generated prescription.', { align: 'center' });

            // Finalize document assembly
            doc.end();
        } catch (error) {
            logger.error(`Prescription PDF Generation Error: ${error.message}`);
            reject(error);
        }
    });
};

/**
 * Generates a PDF buffer for an e-commerce pharmacy order invoice.
 * @param {Object} invoiceData - High-level order details (IDs, dates, patient info, totals).
 * @param {Array} productsData - Array of objects containing individual product details for the order.
 * @returns {Promise<Buffer>} - Resolves with the binary PDF data.
 */
const generateInvoicePdf = (invoiceData, productsData) => {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 50, size: 'A4' });
            const buffers = [];

            doc.on('data', buffers.push.bind(buffers));
            doc.on('end', () => {
                resolve(Buffer.concat(buffers));
            });

            // === 1. HEADER SECTIONS ===
            // Company Branding
            doc.fontSize(24).font('Helvetica-Bold').text('AyurCure', 50, 50);
            doc.fontSize(10).font('Helvetica').text('Digital Ayurveda Platform', 50, 80);
            doc.text('support@ayurcure.com | 1800-AYUR-CARE', 50, 95);

            // Tax/GST Placeholder (Adjust based on business logic)
            doc.text('GSTIN: 22AAAAA0000A1Z5', 50, 110);

            // Invoice Title & Meta
            doc.fontSize(20).text('TAX INVOICE', 400, 50, { align: 'right' });
            doc.fontSize(10).text(`Order No: ${invoiceData.order_id}`, 400, 80, { align: 'right' });
            doc.text(`Date: ${new Date(invoiceData.created_at).toLocaleDateString()}`, 400, 95, { align: 'right' });

            // Separator Line
            doc.moveTo(50, 140).lineTo(550, 140).stroke();

            // === 2. BILLING & SHIPPING DETAILS ===
            doc.moveDown(2);
            doc.fontSize(12).font('Helvetica-Bold').text('Billed To:', 50, 160);
            doc.fontSize(10).font('Helvetica').text(invoiceData.patient_name || 'Valued Customer', 50, 175);
            doc.text(invoiceData.patient_email || '', 50, 190);

            // Limit address width to avoid overlapping
            doc.text(`Shipping Address: ${invoiceData.shipping_address || 'Address Not Provided'}`, 50, 205, { width: 250 });

            doc.font('Helvetica-Bold').text('Payment Method:', 350, 160);
            doc.font('Helvetica').text(invoiceData.payment_method || 'Online', 350, 175);
            doc.font('Helvetica-Bold').text('Payment Status:', 350, 195);
            doc.font('Helvetica').text(invoiceData.payment_status || 'Paid', 350, 210);

            // Separator Line
            doc.moveTo(50, 250).lineTo(550, 250).stroke();

            // === 3. ITEMIZED PRODUCT TABLE ===
            let tableTop = 270;

            // Table Headers
            doc.font('Helvetica-Bold');
            doc.text('Item Description', 50, tableTop);
            doc.text('Quantity', 280, tableTop, { width: 90, align: 'right' });
            doc.text('Unit Price', 370, tableTop, { width: 90, align: 'right' });
            doc.text('Total (Rs.)', 460, tableTop, { width: 90, align: 'right' });

            // Underline headers
            doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

            doc.font('Helvetica');
            let y = tableTop + 25;

            // Iterate through products
            productsData.forEach((product) => {
                // Ensure text wraps properly if product name is long
                doc.text(product.name || 'Ayurvedic Medicine', 50, y, { width: 220 });
                doc.text(product.quantity.toString(), 280, y, { width: 90, align: 'right' });

                // Calculate unit price (subtotal / quantity) if not directly provided
                const unitPrice = product.price || (product.subtotal / product.quantity).toFixed(2);
                doc.text(`Rs. ${unitPrice}`, 370, y, { width: 90, align: 'right' });

                doc.text(`Rs. ${product.subtotal}`, 460, y, { width: 90, align: 'right' });

                y += 20; // Move down for the next row

                // Add a new page if the table gets too long
                if (y > 700) {
                    doc.addPage();
                    y = 50; // Reset y position for the new page
                }
            });

            // Separator Line before totals
            doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke();

            // === 4. FINANCIAL SUMMARY ===
            y += 25;

            // Assuming tax is calculated or included. We create a generic format.
            const totalAmount = parseFloat(invoiceData.total_amount);
            const discount = parseFloat(invoiceData.discount_applied || 0);

            doc.font('Helvetica-Bold');
            doc.text('Subtotal:', 370, y, { width: 90, align: 'right' });
            doc.font('Helvetica').text(`Rs. ${(totalAmount + discount).toFixed(2)}`, 460, y, { width: 90, align: 'right' });

            y += 20;
            if (discount > 0) {
                doc.font('Helvetica-Bold');
                doc.text('Discount:', 370, y, { width: 90, align: 'right' });
                doc.font('Helvetica').text(`- Rs. ${discount.toFixed(2)}`, 460, y, { width: 90, align: 'right' });
                y += 20;
            }

            // Final Total Line
            doc.moveTo(350, y).lineTo(550, y).stroke();
            y += 10;

            doc.fontSize(14).font('Helvetica-Bold');
            doc.text('Grand Total:', 320, y, { width: 140, align: 'right' });
            doc.text(`Rs. ${totalAmount.toFixed(2)}`, 460, y, { width: 90, align: 'right' });

            // === 5. FOOTER ===
            doc.fontSize(10).font('Helvetica').text(
                'Thank you for your business. For any discrepancies, please contact support within 7 days.',
                50,
                750,
                { align: 'center' }
            );

            doc.end();
        } catch (error) {
            logger.error(`Invoice PDF Generation Error: ${error.message}`);
            reject(error);
        }
    });
};

module.exports = { generatePrescriptionPdf, generateInvoicePdf };