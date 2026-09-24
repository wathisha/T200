-- =============================================================================
-- Science with Laknath ERP - Complete Cloud MySQL Database Schema & Seed Data
-- =============================================================================
-- Database: science_lms_db
-- Compatibility: MySQL 5.7+, MySQL 8.0+, TiDB Cloud, Aiven MySQL, MariaDB 10.3+
-- =============================================================================

CREATE DATABASE IF NOT EXISTS science_lms_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE science_lms_db;

-- -----------------------------------------------------------------------------
-- 1. Table: users (Multi-User Admin, Teacher & Staff Accounts with RBAC)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(64) DEFAULT NULL,
    role VARCHAR(64) NOT NULL DEFAULT 'teacher',
    role_name VARCHAR(128) DEFAULT NULL,
    title VARCHAR(255) DEFAULT NULL,
    avatar TEXT DEFAULT NULL,
    permissions JSON DEFAULT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'active',
    created_date VARCHAR(32) DEFAULT NULL,
    last_login VARCHAR(64) DEFAULT 'Never logged in',
    last_device VARCHAR(128) DEFAULT 'None',
    device_sessions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. Table: students (Comprehensive Student Records, Progress, Marks & Analytics)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(64) NOT NULL PRIMARY KEY,
    tab_name VARCHAR(128) DEFAULT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(64) DEFAULT NULL,
    password VARCHAR(255) DEFAULT NULL,
    grade_class VARCHAR(64) DEFAULT NULL,
    homeroom_teacher VARCHAR(255) DEFAULT NULL,
    parent_whatsapp VARCHAR(64) DEFAULT NULL,
    student_info JSON DEFAULT NULL,
    weekly_progress JSON DEFAULT NULL,
    monthly_progress JSON DEFAULT NULL,
    assessments JSON DEFAULT NULL,
    summary JSON DEFAULT NULL,
    teacher_notes JSON DEFAULT NULL,
    student_files JSON DEFAULT NULL,
    raw_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_student_name (name),
    INDEX idx_student_grade (grade_class),
    INDEX idx_student_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. Table: erp_config (Global System Settings, Grading Scale, Batches, Zoom)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS erp_config (
    config_key VARCHAR(64) NOT NULL PRIMARY KEY,
    config_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. Table: teacher_docs (Confidential Teacher Vault Documents & Resources)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS teacher_docs (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    grade VARCHAR(64) DEFAULT NULL,
    category VARCHAR(64) DEFAULT NULL,
    file_url TEXT DEFAULT NULL,
    file_size VARCHAR(64) DEFAULT NULL,
    upload_date VARCHAR(32) DEFAULT NULL,
    uploaded_by VARCHAR(255) DEFAULT NULL,
    description TEXT DEFAULT NULL,
    raw_data JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_doc_grade (grade),
    INDEX idx_doc_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. Table: activity_logs (Audit Trail, Multi-Device Logs & Security Events)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_logs (
    id VARCHAR(64) NOT NULL PRIMARY KEY,
    timestamp VARCHAR(64) NOT NULL,
    username VARCHAR(64) DEFAULT NULL,
    user_full_name VARCHAR(255) DEFAULT NULL,
    role VARCHAR(64) DEFAULT NULL,
    action VARCHAR(64) NOT NULL,
    device_type VARCHAR(128) DEFAULT NULL,
    device_detail VARCHAR(255) DEFAULT NULL,
    ip VARCHAR(64) DEFAULT NULL,
    details TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_log_timestamp (timestamp),
    INDEX idx_log_action (action),
    INDEX idx_log_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
