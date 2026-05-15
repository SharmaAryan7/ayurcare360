-- ==========================================
-- 0. CLEAN SLATE (Drops existing data & tables)
-- ==========================================
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. ENUM DEFINITIONS
-- ==========================================
CREATE TYPE user_role AS ENUM ('patient', 'doctor', 'admin');
CREATE TYPE auth_provider_type AS ENUM ('local', 'google', 'apple');
CREATE TYPE account_status_type AS ENUM ('Active', 'Deactivated', 'Banned');
CREATE TYPE prakriti_enum AS ENUM ('Vata', 'Pitta', 'Kapha');
CREATE TYPE record_enum AS ENUM ('Prescription', 'Lab Report', 'Other');
CREATE TYPE verification_enum AS ENUM ('Pending', 'Verified', 'Active');
CREATE TYPE appointment_mode AS ENUM ('Video', 'Audio', 'Chat');
CREATE TYPE appointment_status AS ENUM ('Scheduled', 'Completed', 'Cancelled');
CREATE TYPE discount_enum AS ENUM ('Percentage', 'Flat');
CREATE TYPE payout_status_enum AS ENUM ('Pending', 'Processing', 'Paid');
CREATE TYPE banner_type AS ENUM ('App Banner', 'Push Notification');
CREATE TYPE banner_status AS ENUM ('Draft', 'Active', 'Archived');
CREATE TYPE article_status AS ENUM ('Pending Review', 'Published');

-- ==========================================
-- 2. CORE AUTHENTICATION & VERIFICATION
-- ==========================================
CREATE TABLE Users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role user_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    auth_provider auth_provider_type,
    password_hash VARCHAR(255),
    
    -- SSO and Notifications
    google_id VARCHAR(255) UNIQUE, 
    fcm_token VARCHAR(255),        
    
    otp_hash VARCHAR(255),
    otp_expires_at TIMESTAMP,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    account_status account_status_type DEFAULT 'Active',
    ban_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE TempVerifications (
    email VARCHAR(255) PRIMARY KEY,
    phone VARCHAR(20),
    email_otp_hash VARCHAR(255),
    phone_otp_hash VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    is_email_verified BOOLEAN DEFAULT false,
    is_phone_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 3. PATIENT MODULE
-- ==========================================
CREATE TABLE PatientProfiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    age INT,
    gender VARCHAR(50),
    health_history TEXT,
    prakriti_type prakriti_enum,
    prakriti_report_url VARCHAR(500),
    referral_code VARCHAR(50) UNIQUE,
    wallet_credits DECIMAL(10, 2) DEFAULT 0.00,
    patient_display_id VARCHAR(50) UNIQUE,
    clinical_status VARCHAR(50) DEFAULT 'Active',
    dob DATE,
    blood_group VARCHAR(10),
    height_cm DECIMAL(5, 2),
    weight_kg DECIMAL(5, 2),
    bmi DECIMAL(5, 2),
    vikruti VARCHAR(100),
    address TEXT,
    diet_preference VARCHAR(100),
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_relation VARCHAR(50),
    emergency_contact_phone VARCHAR(20),
    chief_complaints TEXT,
    medical_history TEXT,
    current_medications JSONB,
    lifestyle_profile TEXT,
    treatment_plan TEXT,
    doctor_notes TEXT,
    primary_doctor_id UUID REFERENCES Users(id) ON DELETE SET NULL,
    settings JSONB DEFAULT '{}',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HealthLogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    sleep_hours DECIMAL(4, 2),
    water_intake DECIMAL(5, 2),
    stress_level VARCHAR(50),
    symptoms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE HealthStats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    weight DECIMAL(5, 2),
    sleep_hours DECIMAL(4, 2),
    bp VARCHAR(20),
    dosha_balance INT, 
    water_intake DECIMAL(5, 2),
    stress_level VARCHAR(50),
    symptoms TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PatientRoutines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID UNIQUE NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    morning TEXT,
    afternoon TEXT,
    evening TEXT,
    night TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE WellnessPlans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID UNIQUE NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    dinacharya_routine TEXT,
    diet_chart TEXT,
    yoga_schedule TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PatientDocuments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    document_name VARCHAR(255),
    document_type VARCHAR(100),
    file_url VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE WellnessTips (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 4. DOCTOR MODULE
-- ==========================================
CREATE TABLE DoctorProfiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
    qualifications VARCHAR(255),
    registration_number VARCHAR(100) UNIQUE,
    specialization VARCHAR(100),
    experience_years INT,
    verification_status verification_enum DEFAULT 'Pending',
    consultation_fee DECIMAL(10, 2),
    location VARCHAR(255),
    languages TEXT[], 
    consultation_duration_mins INT DEFAULT 30,
    availability_summary VARCHAR(255), 
    publications_count INT DEFAULT 0,
    average_rating DECIMAL(3, 2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    bio TEXT,
    education_details JSONB, 
    sub_specializations TEXT[], 
    certifications TEXT[],
    philosophy_of_care TEXT,
    preferences JSONB DEFAULT '{}',
    profile_image_url VARCHAR(255),
    total_earnings DECIMAL(12, 2) DEFAULT 0.00,
    admin_comments TEXT,
    verified_by_admin_id UUID REFERENCES Users(id) ON DELETE SET NULL
);

CREATE TABLE DoctorSlots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES DoctorProfiles(id) ON DELETE CASCADE,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_booked BOOLEAN DEFAULT false
);

CREATE TABLE Articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES DoctorProfiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    status article_status DEFAULT 'Pending Review'
);

-- ==========================================
-- 5. APPOINTMENT MODULE
-- ==========================================
CREATE TABLE Appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    doctor_id UUID NOT NULL REFERENCES DoctorProfiles(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES DoctorSlots(id) ON DELETE SET NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    mode appointment_mode NOT NULL,
    status appointment_status DEFAULT 'Scheduled',
    meet_link VARCHAR(500),
    pre_consultation_symptoms TEXT,
    chief_complaint TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES Appointments(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    medicine_name VARCHAR(255),
    dosage VARCHAR(100),
    timing VARCHAR(100),
    duration VARCHAR(100),
    lifestyle_advice TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE AppointmentReviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID UNIQUE NOT NULL REFERENCES Appointments(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 6. E-COMMERCE MODULE
-- ==========================================
CREATE TABLE Products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    brand VARCHAR(100),
    ingredients TEXT,
    benefits TEXT,
    usage_instructions TEXT,
    certifications VARCHAR(255),
    prakriti_suitability VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url VARCHAR(500)
);

CREATE TABLE Wishlists (
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    PRIMARY KEY (patient_id, product_id)
);

CREATE TABLE Orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(10, 2) NOT NULL,
    discount_applied DECIMAL(10, 2) DEFAULT 0.00,
    shipping_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    payment_status VARCHAR(50),
    razorpay_order_id VARCHAR(255), 
    razorpay_payment_id VARCHAR(255),
    order_status VARCHAR(50),
    delivery_eta TIMESTAMP,
    pending_tasks INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PaymentHistory (
    id SERIAL PRIMARY KEY,
    order_id UUID REFERENCES Orders(id) ON DELETE CASCADE,
    patient_id UUID REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    razorpay_order_id VARCHAR(255),
    razorpay_payment_id VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OrderItems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES Orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES Products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);

CREATE TABLE Subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES PatientProfiles(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES Products(id) ON DELETE CASCADE,
    frequency VARCHAR(50) NOT NULL,
    next_billing_date DATE,
    status VARCHAR(50)
);

CREATE TABLE Coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    discount_type discount_enum NOT NULL,
    expiry_date TIMESTAMP
);

-- ==========================================
-- 7. ADMIN & PLATFORM MODULE
-- ==========================================
CREATE TABLE Payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_id UUID NOT NULL REFERENCES DoctorProfiles(id) ON DELETE RESTRICT,
    processed_by_admin_id UUID REFERENCES Users(id) ON DELETE SET NULL,
    period_start DATE,
    period_end DATE,
    total_consultations INT,
    amount_due DECIMAL(10, 2),
    status payout_status_enum DEFAULT 'Pending',
    transaction_reference VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE BannerCampaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    target_link VARCHAR(500),
    type banner_type NOT NULL,
    status banner_status DEFAULT 'Draft',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT
);

CREATE TABLE AdminActionLogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID NOT NULL REFERENCES Users(id) ON DELETE RESTRICT,
    action_type VARCHAR(100) NOT NULL,
    target_entity_id UUID,
    details TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    author_id UUID REFERENCES Users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'Draft',
    views INT DEFAULT 0,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);