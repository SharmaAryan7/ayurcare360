const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const crypto = require('crypto');
const path = require('path');
const logger = require('../utils/logger');
const dns = require('dns');

// Force Node.js to use IPv4 first to prevent AWS S3 timeout issues
dns.setDefaultResultOrder('ipv4first');

const isAwsConfigured = process.env.AWS_REGION &&
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_S3_BUCKET_NAME;

if (!isAwsConfigured) {
    logger.warn('AWS S3 credentials or bucket name are missing. File uploads will fail in production.');
}

const s3 = new S3Client({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    }
});

/**
 * Restricts uploads to safe image and document formats.
 */
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/webp',
        'application/pdf'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF are allowed.'), false);
    }
};

const storage = multer.memoryStorage();

const uploadConfig = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit per file
        files: 5 // Maximum 5 files per request
    },
    fileFilter: fileFilter
});

/**
 * Error handling wrapper to safely return multer limitations to the client.
 */
const safeUpload = (req, res, next) => {
    uploadConfig.any()(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: `Upload limit exceeded: ${err.message}` });
        } else if (err) {
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};

/**
 * Uploads processed memory buffers directly to AWS S3.
 */
const uploadToS3 = async (req, res, next) => {
    if (!req.file && (!req.files || req.files.length === 0)) {
        return next();
    }

    if (!isAwsConfigured) {
        return res.status(500).json({ error: "Storage configuration is missing. Cannot process upload." });
    }

    try {
        const uploadBuffer = async (file) => {
            const fileExtension = path.extname(file.originalname);
            const fileName = `${crypto.randomBytes(16).toString('hex')}${fileExtension}`;

            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `uploads/${fileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            };

            const command = new PutObjectCommand(params);
            await s3.send(command);

            file.s3Url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
        };

        if (req.file) {
            await uploadBuffer(req.file);
        } else if (req.files) {
            await Promise.all(req.files.map(file => uploadBuffer(file)));
        }

        next();
    } catch (error) {
        logger.error(`S3 Upload Error: ${error.message}`);
        res.status(500).json({ error: "Failed to securely upload file to storage" });
    }
};

module.exports = { upload: uploadConfig, uploadToS3 };