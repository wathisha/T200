/**
 * ============================================================================
 * Science with Laknath ERP - Universal Database Engine
 * ============================================================================
 * Supports:
 *  1. Cloud MySQL Database (Aiven, TiDB Cloud Serverless, Clever Cloud, Railway, AWS RDS)
 *  2. Local Pure JSON File Storage Fallback
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Try loading dotenv if present
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not installed or .env not loaded, fallback to process.env
}

const DATA_DIR = path.join(__dirname, 'assets', 'data');
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json');
const CONFIG_FILE = path.join(DATA_DIR, 'erp-config.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const DOCS_FILE = path.join(DATA_DIR, 'teacher-docs.json');
const LOGS_FILE = path.join(DATA_DIR, 'activity-logs.json');

// Configuration
const DB_TYPE = (process.env.DB_TYPE || (process.env.DB_HOST ? 'mysql' : 'json')).toLowerCase();
let mysql = null;
let pool = null;
let isInitialized = false;

// Attempt to load mysql2 if DB_TYPE is mysql
if (DB_TYPE === 'mysql') {
    try {
        mysql = require('mysql2/promise');
    } catch (err) {
        console.warn('⚠️  mysql2 package not found. Running in JSON file mode until `npm install mysql2` is executed.');
    }
}

// -----------------------------------------------------------------------------
// JSON Helper Functions (Local Storage Mode & Seeding Source)
// -----------------------------------------------------------------------------
function readJsonFile(filePath, defaultVal = []) {
    try {
        if (!fs.existsSync(filePath)) return defaultVal;
        const raw = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(raw);
    } catch (e) {
        console.error('Error reading file ' + filePath + ':', e.message);
        return defaultVal;
    }
}

function writeJsonFile(filePath, data) {
    try {
        if (!fs.existsSync(path.dirname(filePath))) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (e) {
        console.error('Error writing file ' + filePath + ':', e.message);
        return false;
    }
}

// -----------------------------------------------------------------------------
// MySQL Table Definitions
// -----------------------------------------------------------------------------
const CREATE_TABLE_USERS = `
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
`;

const CREATE_TABLE_STUDENTS = `
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
`;

const CREATE_TABLE_ERP_CONFIG = `
CREATE TABLE IF NOT EXISTS erp_config (
    config_key VARCHAR(64) NOT NULL PRIMARY KEY,
    config_data LONGTEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

const CREATE_TABLE_TEACHER_DOCS = `
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
`;

const CREATE_TABLE_ACTIVITY_LOGS = `
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
`;

// -----------------------------------------------------------------------------
// Database Initialization & Connection Pool Management
// -----------------------------------------------------------------------------
async function init() {
    if (isInitialized) return true;

    if (DB_TYPE === 'mysql' && mysql) {
        try {
            const sslOption = process.env.DB_SSL === 'true' || process.env.DB_SSL === '1'
                ? { rejectUnauthorized: false }
                : undefined;

            let poolConfig = {
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '3306', 10),
                user: process.env.DB_USER || 'root',
                password: process.env.DB_PASSWORD || '',
                database: process.env.DB_NAME || 'science_lms_db',
                waitForConnections: process.env.DB_WAIT_FOR_CONNECTIONS !== 'false',
                connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
                queueLimit: parseInt(process.env.DB_QUEUE_LIMIT || '0', 10),
                charset: 'utf8mb4'
            };

            if (sslOption) {
                poolConfig.ssl = sslOption;
            }

            if (process.env.MYSQL_URI) {
                pool = mysql.createPool(process.env.MYSQL_URI);
            } else {
                pool = mysql.createPool(poolConfig);
            }

            // Test connection
            const connection = await pool.getConnection();
            console.log(`✅ [MySQL Engine] Connected successfully to MySQL Database '${poolConfig.database}' at ${poolConfig.host}:${poolConfig.port}`);
            
            // Create tables if they do not exist
            await connection.query(CREATE_TABLE_USERS);
            await connection.query(CREATE_TABLE_STUDENTS);
            await connection.query(CREATE_TABLE_ERP_CONFIG);
            await connection.query(CREATE_TABLE_TEACHER_DOCS);
            await connection.query(CREATE_TABLE_ACTIVITY_LOGS);
            
            connection.release();

            // Auto-seed if database is empty
            await autoSeedFromLocalJsonIfEmpty();

            isInitialized = true;
            return true;
        } catch (err) {
            console.error('❌ [MySQL Engine Error] Could not connect to MySQL:', err.message);
            console.warn('⚠️  Falling back to local JSON database storage.');
            pool = null;
        }
    }

    // Default JSON fallback
    ensureJsonFilesExist();
    isInitialized = true;
    return true;
}

function ensureJsonFilesExist() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(USERS_FILE)) {
        writeJsonFile(USERS_FILE, []);
    }
    if (!fs.existsSync(STUDENTS_FILE)) {
        writeJsonFile(STUDENTS_FILE, []);
    }
    if (!fs.existsSync(CONFIG_FILE)) {
        writeJsonFile(CONFIG_FILE, {});
    }
    if (!fs.existsSync(DOCS_FILE)) {
        writeJsonFile(DOCS_FILE, []);
    }
    if (!fs.existsSync(LOGS_FILE)) {
        writeJsonFile(LOGS_FILE, []);
    }
}

// Auto-seed cloud MySQL tables if they are empty
async function autoSeedFromLocalJsonIfEmpty() {
    if (!pool) return;
    try {
        const [userRows] = await pool.query('SELECT COUNT(*) as count FROM users');
        if (userRows[0].count === 0 && fs.existsSync(USERS_FILE)) {
            const localUsers = readJsonFile(USERS_FILE, []);
            if (localUsers.length > 0) {
                console.log(`🌱 [MySQL Auto-Seed] Seeding ${localUsers.length} user accounts into MySQL...`);
                for (const u of localUsers) {
                    await createUser(u);
                }
            }
        }

        const [studentRows] = await pool.query('SELECT COUNT(*) as count FROM students');
        if (studentRows[0].count === 0 && fs.existsSync(STUDENTS_FILE)) {
            const localStudents = readJsonFile(STUDENTS_FILE, []);
            if (localStudents.length > 0) {
                console.log(`🌱 [MySQL Auto-Seed] Seeding ${localStudents.length} students into MySQL...`);
                await saveStudents(localStudents);
            }
        }

        const [configRows] = await pool.query('SELECT COUNT(*) as count FROM erp_config');
        if (configRows[0].count === 0 && fs.existsSync(CONFIG_FILE)) {
            const localConfig = readJsonFile(CONFIG_FILE, {});
            if (Object.keys(localConfig).length > 0) {
                console.log('🌱 [MySQL Auto-Seed] Seeding ERP configuration into MySQL...');
                await saveConfig(localConfig);
            }
        }

        const [docRows] = await pool.query('SELECT COUNT(*) as count FROM teacher_docs');
        if (docRows[0].count === 0 && fs.existsSync(DOCS_FILE)) {
            const localDocs = readJsonFile(DOCS_FILE, []);
            if (localDocs.length > 0) {
                console.log(`🌱 [MySQL Auto-Seed] Seeding ${localDocs.length} teacher documents into MySQL...`);
                await saveDocuments(localDocs);
            }
        }

        const [logRows] = await pool.query('SELECT COUNT(*) as count FROM activity_logs');
        if (logRows[0].count === 0 && fs.existsSync(LOGS_FILE)) {
            const localLogs = readJsonFile(LOGS_FILE, []);
            if (localLogs.length > 0) {
                console.log(`🌱 [MySQL Auto-Seed] Seeding ${localLogs.length} initial activity logs into MySQL...`);
                for (const l of localLogs) {
                    await addLog(l);
                }
            }
        }
    } catch (e) {
        console.error('Error during auto-seed:', e.message);
    }
}

// -----------------------------------------------------------------------------
// Database Operations: STATUS & STATS
// -----------------------------------------------------------------------------
async function getStatus() {
    await init();
    if (pool) {
        try {
            const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
            const [students] = await pool.query('SELECT COUNT(*) as count FROM students');
            const [docs] = await pool.query('SELECT COUNT(*) as count FROM teacher_docs');
            const [logs] = await pool.query('SELECT COUNT(*) as count FROM activity_logs');
            const [cfg] = await pool.query('SELECT COUNT(*) as count FROM erp_config');

            return {
                engine: 'MySQL Cloud Database',
                connected: true,
                host: process.env.DB_HOST || 'localhost',
                database: process.env.DB_NAME || 'science_lms_db',
                ssl: process.env.DB_SSL === 'true',
                stats: {
                    usersCount: users[0].count,
                    studentsCount: students[0].count,
                    teacherDocsCount: docs[0].count,
                    logsCount: logs[0].count,
                    configLoaded: cfg[0].count > 0
                }
            };
        } catch (e) {
            return {
                engine: 'MySQL (Degraded/Error)',
                connected: false,
                error: e.message
            };
        }
    } else {
        const users = readJsonFile(USERS_FILE, []);
        const students = readJsonFile(STUDENTS_FILE, []);
        const docs = readJsonFile(DOCS_FILE, []);
        const logs = readJsonFile(LOGS_FILE, []);
        const cfg = readJsonFile(CONFIG_FILE, {});

        return {
            engine: 'Pure JSON Storage (Local)',
            connected: true,
            stats: {
                usersCount: users.length,
                studentsCount: students.length,
                teacherDocsCount: docs.length,
                logsCount: logs.length,
                configLoaded: !!cfg.settings
            }
        };
    }
}

// -----------------------------------------------------------------------------
// Database Operations: USERS & AUTH
// -----------------------------------------------------------------------------
function mapUserRow(row) {
    if (!row) return null;
    let permissions = row.permissions;
    if (typeof permissions === 'string') {
        try { permissions = JSON.parse(permissions); } catch (e) { permissions = []; }
    }
    let deviceSessions = row.device_sessions;
    if (typeof deviceSessions === 'string') {
        try { deviceSessions = JSON.parse(deviceSessions); } catch (e) { deviceSessions = []; }
    }

    return {
        id: row.id,
        username: row.username,
        password: row.password,
        name: row.name,
        email: row.email,
        phone: row.phone,
        role: row.role,
        roleName: row.role_name,
        title: row.title,
        avatar: row.avatar,
        permissions: Array.isArray(permissions) ? permissions : [],
        status: row.status,
        createdDate: row.created_date,
        lastLogin: row.last_login,
        lastDevice: row.last_device,
        deviceSessions: Array.isArray(deviceSessions) ? deviceSessions : []
    };
}

async function getUsers() {
    await init();
    if (pool) {
        const [rows] = await pool.query('SELECT * FROM users ORDER BY created_at ASC');
        return rows.map(mapUserRow);
    }
    return readJsonFile(USERS_FILE, []);
}

async function getUserByUsername(username) {
    await init();
    const cleanUser = (username || '').trim().toLowerCase();
    if (!cleanUser) return null;

    if (pool) {
        const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(username) = ? LIMIT 1', [cleanUser]);
        if (rows.length > 0) return mapUserRow(rows[0]);
        return null;
    }

    const users = readJsonFile(USERS_FILE, []);
    return users.find(u => (u.username || '').toLowerCase() === cleanUser) || null;
}

async function getUserById(id) {
    await init();
    if (!id) return null;

    if (pool) {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ? OR LOWER(username) = LOWER(?) LIMIT 1', [id, id]);
        if (rows.length > 0) return mapUserRow(rows[0]);
        return null;
    }

    const users = readJsonFile(USERS_FILE, []);
    return users.find(u => u.id === id || (u.username || '').toLowerCase() === id.toLowerCase()) || null;
}

async function createUser(user) {
    await init();
    if (pool) {
        const id = user.id || ('USR-' + (Date.now().toString().slice(-4) + Math.floor(Math.random() * 100)));
        const cleanUser = (user.username || '').trim().toLowerCase();
        const permissions = JSON.stringify(user.permissions || ['grade_students', 'manage_content']);
        const deviceSessions = JSON.stringify(user.deviceSessions || []);

        const sql = `
            INSERT INTO users (id, username, password, name, email, phone, role, role_name, title, avatar, permissions, status, created_date, last_login, last_device, device_sessions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                password = VALUES(password),
                name = VALUES(name),
                email = VALUES(email),
                phone = VALUES(phone),
                role = VALUES(role),
                role_name = VALUES(role_name),
                title = VALUES(title),
                avatar = VALUES(avatar),
                permissions = VALUES(permissions),
                status = VALUES(status)
        `;

        await pool.query(sql, [
            id,
            cleanUser,
            user.password || 'password123',
            user.name || '',
            user.email || `${cleanUser}@scienceacademy.lk`,
            user.phone || '071 781 2092',
            user.role || 'teacher',
            user.roleName || 'Science Teacher',
            user.title || 'Science Educator',
            user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name || cleanUser)}`,
            permissions,
            user.status || 'active',
            user.createdDate || new Date().toISOString().split('T')[0],
            user.lastLogin || 'Never logged in',
            user.lastDevice || 'None',
            deviceSessions
        ]);

        return await getUserById(id);
    }

    // JSON fallback
    const users = readJsonFile(USERS_FILE, []);
    users.push(user);
    writeJsonFile(USERS_FILE, users);
    return user;
}

async function updateUser(targetIdOrUser, updates) {
    await init();
    if (pool) {
        const existing = await getUserById(targetIdOrUser);
        if (!existing) return null;

        const merged = { ...existing, ...updates };
        const permissions = JSON.stringify(merged.permissions || []);
        const deviceSessions = JSON.stringify(merged.deviceSessions || []);

        const sql = `
            UPDATE users SET
                name = ?,
                password = ?,
                email = ?,
                phone = ?,
                role = ?,
                role_name = ?,
                title = ?,
                avatar = ?,
                permissions = ?,
                status = ?,
                last_login = ?,
                last_device = ?,
                device_sessions = ?
            WHERE id = ? OR LOWER(username) = LOWER(?)
        `;

        await pool.query(sql, [
            merged.name,
            merged.password,
            merged.email,
            merged.phone,
            merged.role,
            merged.roleName,
            merged.title,
            merged.avatar,
            permissions,
            merged.status,
            merged.lastLogin,
            merged.lastDevice,
            deviceSessions,
            existing.id,
            existing.username
        ]);

        return await getUserById(existing.id);
    }

    // JSON fallback
    let users = readJsonFile(USERS_FILE, []);
    const idx = users.findIndex(u => u.id === targetIdOrUser || (u.username || '').toLowerCase() === targetIdOrUser.toLowerCase());
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...updates };
    writeJsonFile(USERS_FILE, users);
    return users[idx];
}

async function deleteUser(targetIdOrUser) {
    await init();
    if (pool) {
        const existing = await getUserById(targetIdOrUser);
        if (!existing) return false;
        await pool.query('DELETE FROM users WHERE id = ? OR LOWER(username) = LOWER(?)', [existing.id, existing.username]);
        return true;
    }

    let users = readJsonFile(USERS_FILE, []);
    const before = users.length;
    users = users.filter(u => u.id !== targetIdOrUser && (u.username || '').toLowerCase() !== targetIdOrUser.toLowerCase());
    writeJsonFile(USERS_FILE, users);
    return users.length < before;
}

// -----------------------------------------------------------------------------
// Database Operations: STUDENTS
// -----------------------------------------------------------------------------
function mapStudentRow(row) {
    if (!row) return null;
    if (row.raw_data) {
        try {
            return JSON.parse(row.raw_data);
        } catch (e) {}
    }
    return {
        tab_name: row.tab_name,
        student_info: typeof row.student_info === 'string' ? JSON.parse(row.student_info) : row.student_info,
        weekly_progress: typeof row.weekly_progress === 'string' ? JSON.parse(row.weekly_progress) : row.weekly_progress,
        monthly_progress: typeof row.monthly_progress === 'string' ? JSON.parse(row.monthly_progress) : row.monthly_progress,
        assessments: typeof row.assessments === 'string' ? JSON.parse(row.assessments) : row.assessments,
        summary: typeof row.summary === 'string' ? JSON.parse(row.summary) : row.summary,
        teacher_notes: typeof row.teacher_notes === 'string' ? JSON.parse(row.teacher_notes) : row.teacher_notes,
        student_files: typeof row.student_files === 'string' ? JSON.parse(row.student_files) : row.student_files
    };
}

async function getStudents() {
    await init();
    if (pool) {
        const [rows] = await pool.query('SELECT * FROM students ORDER BY student_id ASC');
        return rows.map(mapStudentRow);
    }
    return readJsonFile(STUDENTS_FILE, []);
}

async function getStudentById(id) {
    await init();
    const cleanId = (id || '').trim();
    if (!cleanId) return null;

    if (pool) {
        const [rows] = await pool.query('SELECT * FROM students WHERE LOWER(student_id) = LOWER(?) LIMIT 1', [cleanId]);
        if (rows.length > 0) return mapStudentRow(rows[0]);
        return null;
    }

    const students = readJsonFile(STUDENTS_FILE, []);
    return students.find(s => s.student_info && s.student_info.student_id.toLowerCase() === cleanId.toLowerCase()) || null;
}

async function saveStudents(studentsArray) {
    await init();
    if (!Array.isArray(studentsArray)) throw new Error('Students payload must be an array');

    if (pool) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();
            for (const s of studentsArray) {
                const sInfo = s.student_info || {};
                const studentId = sInfo.student_id || s.tab_name || ('ST-' + Math.floor(10000 + Math.random() * 90000));
                const name = sInfo.name || s.tab_name || 'Unknown Student';
                const username = sInfo.username || '';
                const password = sInfo.password || '';
                const gradeClass = sInfo.grade_class || '';
                const homeroomTeacher = sInfo.homeroom_teacher || '';
                const parentWhatsapp = sInfo.parent_whatsapp || '';
                const rawData = JSON.stringify(s);

                const sql = `
                    INSERT INTO students (
                        student_id, tab_name, name, username, password, grade_class,
                        homeroom_teacher, parent_whatsapp, student_info, weekly_progress,
                        monthly_progress, assessments, summary, teacher_notes, student_files, raw_data
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON DUPLICATE KEY UPDATE
                        tab_name = VALUES(tab_name),
                        name = VALUES(name),
                        username = VALUES(username),
                        password = VALUES(password),
                        grade_class = VALUES(grade_class),
                        homeroom_teacher = VALUES(homeroom_teacher),
                        parent_whatsapp = VALUES(parent_whatsapp),
                        student_info = VALUES(student_info),
                        weekly_progress = VALUES(weekly_progress),
                        monthly_progress = VALUES(monthly_progress),
                        assessments = VALUES(assessments),
                        summary = VALUES(summary),
                        teacher_notes = VALUES(teacher_notes),
                        student_files = VALUES(student_files),
                        raw_data = VALUES(raw_data)
                `;

                await connection.query(sql, [
                    studentId,
                    s.tab_name || '',
                    name,
                    username,
                    password,
                    gradeClass,
                    homeroomTeacher,
                    parentWhatsapp,
                    JSON.stringify(s.student_info || {}),
                    JSON.stringify(s.weekly_progress || []),
                    JSON.stringify(s.monthly_progress || []),
                    JSON.stringify(s.assessments || []),
                    JSON.stringify(s.summary || {}),
                    JSON.stringify(s.teacher_notes || []),
                    JSON.stringify(s.student_files || []),
                    rawData
                ]);
            }
            await connection.commit();
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }

        // Also update local file cache for high-availability backup
        writeJsonFile(STUDENTS_FILE, studentsArray);
        return true;
    }

    return writeJsonFile(STUDENTS_FILE, studentsArray);
}

// -----------------------------------------------------------------------------
// Database Operations: ERP CONFIG
// -----------------------------------------------------------------------------
async function getConfig() {
    await init();
    if (pool) {
        const [rows] = await pool.query('SELECT config_data FROM erp_config WHERE config_key = ? LIMIT 1', ['master_config']);
        if (rows.length > 0) {
            try {
                return JSON.parse(rows[0].config_data);
            } catch (e) {
                return {};
            }
        }
        return readJsonFile(CONFIG_FILE, {});
    }
    return readJsonFile(CONFIG_FILE, {});
}

async function saveConfig(configData) {
    await init();
    if (pool) {
        const raw = JSON.stringify(configData);
        const sql = `
            INSERT INTO erp_config (config_key, config_data)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE config_data = VALUES(config_data)
        `;
        await pool.query(sql, ['master_config', raw]);
        writeJsonFile(CONFIG_FILE, configData);
        return true;
    }
    return writeJsonFile(CONFIG_FILE, configData);
}

// -----------------------------------------------------------------------------
// Database Operations: TEACHER VAULT DOCUMENTS
// -----------------------------------------------------------------------------
function mapDocRow(row) {
    if (!row) return null;
    if (row.raw_data) {
        try {
            return JSON.parse(row.raw_data);
        } catch (e) {}
    }
    return {
        id: row.id,
        title: row.title,
        grade: row.grade,
        category: row.category,
        fileUrl: row.file_url,
        fileSize: row.file_size,
        uploadDate: row.upload_date,
        uploadedBy: row.uploaded_by,
        description: row.description
    };
}

async function getDocuments() {
    await init();
    if (pool) {
        const [rows] = await pool.query('SELECT * FROM teacher_docs ORDER BY id DESC');
        return rows.map(mapDocRow);
    }
    return readJsonFile(DOCS_FILE, []);
}

async function saveDocument(doc) {
    await init();
    const newDoc = {
        id: doc.id || ('TDOC-' + Date.now()),
        uploadDate: doc.uploadDate || new Date().toISOString().split('T')[0],
        ...doc
    };

    if (pool) {
        const sql = `
            INSERT INTO teacher_docs (id, title, grade, category, file_url, file_size, upload_date, uploaded_by, description, raw_data)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                title = VALUES(title),
                grade = VALUES(grade),
                category = VALUES(category),
                file_url = VALUES(file_url),
                file_size = VALUES(file_size),
                upload_date = VALUES(upload_date),
                uploaded_by = VALUES(uploaded_by),
                description = VALUES(description),
                raw_data = VALUES(raw_data)
        `;

        await pool.query(sql, [
            newDoc.id,
            newDoc.title || 'Untitled Document',
            newDoc.grade || 'All Grades',
            newDoc.category || 'General',
            newDoc.fileUrl || '',
            newDoc.fileSize || 'N/A',
            newDoc.uploadDate,
            newDoc.uploadedBy || 'Mr. Laknath Amarasinghe',
            newDoc.description || '',
            JSON.stringify(newDoc)
        ]);

        return newDoc;
    }

    const docs = readJsonFile(DOCS_FILE, []);
    docs.unshift(newDoc);
    writeJsonFile(DOCS_FILE, docs);
    return newDoc;
}

async function saveDocuments(docsArray) {
    await init();
    if (pool) {
        for (const doc of docsArray) {
            await saveDocument(doc);
        }
        writeJsonFile(DOCS_FILE, docsArray);
        return true;
    }
    return writeJsonFile(DOCS_FILE, docsArray);
}

// -----------------------------------------------------------------------------
// Database Operations: ACTIVITY LOGS
// -----------------------------------------------------------------------------
function mapLogRow(row) {
    if (!row) return null;
    return {
        id: row.id,
        timestamp: row.timestamp,
        username: row.username,
        userFullName: row.user_full_name,
        role: row.role,
        action: row.action,
        deviceType: row.device_type,
        deviceDetail: row.device_detail,
        ip: row.ip,
        details: row.details
    };
}

async function getLogs() {
    await init();
    if (pool) {
        const [rows] = await pool.query('SELECT * FROM activity_logs ORDER BY id DESC LIMIT 500');
        return rows.map(mapLogRow);
    }
    return readJsonFile(LOGS_FILE, []);
}

async function addLog(entry) {
    await init();
    const newLog = {
        id: entry.id || ('LOG-' + Date.now() + Math.floor(Math.random() * 100)),
        timestamp: entry.timestamp || new Date().toISOString().replace('T', ' ').substring(0, 19),
        username: entry.username || 'system',
        userFullName: entry.userFullName || 'System',
        role: entry.role || 'System',
        action: entry.action || 'SYSTEM_ACTION',
        deviceType: entry.deviceType || 'PC / Server',
        deviceDetail: entry.deviceDetail || '',
        ip: entry.ip || '127.0.0.1',
        details: entry.details || ''
    };

    if (pool) {
        const sql = `
            INSERT INTO activity_logs (id, timestamp, username, user_full_name, role, action, device_type, device_detail, ip, details)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        try {
            await pool.query(sql, [
                newLog.id,
                newLog.timestamp,
                newLog.username,
                newLog.userFullName,
                newLog.role,
                newLog.action,
                newLog.deviceType,
                newLog.deviceDetail,
                newLog.ip,
                newLog.details
            ]);
        } catch (e) {
            console.error('Error logging to MySQL:', e.message);
        }
        return newLog;
    }

    const logs = readJsonFile(LOGS_FILE, []);
    logs.unshift(newLog);
    if (logs.length > 500) logs.length = 500;
    writeJsonFile(LOGS_FILE, logs);
    return newLog;
}

// -----------------------------------------------------------------------------
// Full Backup / Export & Restore
// -----------------------------------------------------------------------------
async function exportFullDb() {
    const students = await getStudents();
    const config = await getConfig();
    const users = await getUsers();
    const teacherDocs = await getDocuments();
    const activityLogs = await getLogs();

    return {
        exportTimestamp: new Date().toISOString(),
        academy: 'Science with Laknath ERP',
        databaseEngine: pool ? 'MySQL Cloud Database' : 'JSON Storage',
        students,
        config,
        users,
        teacherDocs,
        activityLogs
    };
}

async function importFullDb(bundle) {
    if (!bundle) throw new Error('Invalid bundle payload');
    if (bundle.students) await saveStudents(bundle.students);
    if (bundle.config) await saveConfig(bundle.config);
    if (bundle.users && Array.isArray(bundle.users)) {
        for (const u of bundle.users) {
            await createUser(u);
        }
    }
    if (bundle.teacherDocs) await saveDocuments(bundle.teacherDocs);
    if (bundle.activityLogs && Array.isArray(bundle.activityLogs)) {
        for (const l of bundle.activityLogs) {
            await addLog(l);
        }
    }
    return true;
}

module.exports = {
    init,
    getStatus,
    getUsers,
    getUserByUsername,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    getStudents,
    getStudentById,
    saveStudents,
    getConfig,
    saveConfig,
    getDocuments,
    saveDocument,
    saveDocuments,
    getLogs,
    addLog,
    exportFullDb,
    importFullDb
};
