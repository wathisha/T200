/**
 * ============================================================================
 * Science with Laknath ERP - Cloud-Ready Multi-User Server
 * ============================================================================
 * Database Support:
 *  - Cloud MySQL (TiDB Cloud Serverless, Aiven MySQL, Clever Cloud, Railway, AWS RDS)
 *  - Pure JSON Fallback Engine (Zero configuration local storage)
 * ============================================================================
 * Usage: node server.js
 * ============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const db = require('./db');

try {
    require('dotenv').config();
} catch (e) {}

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// MIME Types for Static File Serving
const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

// Helper to parse device details from User-Agent and Client Info
function detectDevice(userAgent = '', clientDevice = '') {
    if (clientDevice && clientDevice.trim() !== '') {
        return clientDevice;
    }
    const ua = userAgent.toLowerCase();
    let deviceType = 'PC / Desktop';
    let osName = 'Unknown OS';

    if (/(ipad|tablet|(android(?!.*mobile))|(windows(?!.*phone)(.*touch))|kindle|playbook|silk|(puffin(?!.*(IP|AP|WP))))/.test(ua)) {
        deviceType = 'Tablet / iPad';
    } else if (/(mobi|ipod|phone|blackberry|opera mini|fennec|minimo|symbian|psp|nintendo ds)/.test(ua)) {
        deviceType = 'Mobile Phone';
    }

    if (ua.includes('windows')) osName = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os')) osName = 'macOS';
    else if (ua.includes('iphone')) osName = 'iOS (iPhone)';
    else if (ua.includes('ipad')) osName = 'iPadOS';
    else if (ua.includes('android')) osName = 'Android';
    else if (ua.includes('linux')) osName = 'Linux';

    return `${deviceType} (${osName})`;
}

// Helper to get client IP
function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
}

// JSON API Response Helper
function sendJson(res, statusCode, data) {
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Device-Type, X-Admin-User'
    });
    res.end(JSON.stringify(data));
}

// Get Network Interfaces for LAN display
function getNetworkIps() {
    const interfaces = os.networkInterfaces();
    const ips = [];
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                ips.push(iface.address);
            }
        }
    }
    return ips;
}

// Parse request body helper
function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            if (!body) return resolve({});
            try {
                resolve(JSON.parse(body));
            } catch (e) {
                reject(new Error('Invalid JSON payload'));
            }
        });
        req.on('error', reject);
    });
}

// HTTP Server
const server = http.createServer(async (req, res) => {
    // CORS Preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Device-Type, X-Admin-User');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    const clientIp = getClientIp(req);
    const userAgent = req.headers['user-agent'] || '';

    try {
        // =========================================================================
        // 1. SYSTEM STATUS & HEALTH CHECK API
        // =========================================================================
        if (pathname === '/api/status' && method === 'GET') {
            const dbStatus = await db.getStatus();
            return sendJson(res, 200, {
                status: 'online',
                service: 'Science with Laknath ERP - Universal Cloud Engine',
                version: '4.0.0-MySQL-Cloud',
                serverTime: new Date().toISOString(),
                uptimeSeconds: Math.round(process.uptime()),
                detectedClientDevice: detectDevice(userAgent, req.headers['x-device-type']),
                networkIPs: getNetworkIps(),
                database: dbStatus,
                databaseStats: dbStatus.stats || {}
            });
        }

        // =========================================================================
        // 2. AUTHENTICATION & MULTI-USER LOGIN API
        // =========================================================================
        if (pathname === '/api/auth/login' && method === 'POST') {
            const body = await parseBody(req);
            const { username, password, clientDevice, clientOS, clientBrowser } = body;
            const cleanUser = (username || '').trim().toLowerCase();
            const cleanPass = (password || '').trim();

            if (!cleanUser || !cleanPass) {
                return sendJson(res, 400, { error: 'Username and password are required.' });
            }

            const user = await db.getUserByUsername(cleanUser);

            if (!user || user.password !== cleanPass) {
                await db.addLog({
                    username: cleanUser,
                    userFullName: 'Unknown / Failed Attempt',
                    role: 'None',
                    action: 'AUTH_FAILED',
                    deviceType: detectDevice(userAgent, clientDevice),
                    ip: clientIp,
                    details: `Failed login attempt for username '${cleanUser}'`
                });
                return sendJson(res, 401, { error: 'Invalid username or password.' });
            }

            if (user.status === 'disabled' || user.status === 'inactive') {
                return sendJson(res, 403, { error: 'This user account is deactivated. Contact the Super Administrator.' });
            }

            const detectedDev = detectDevice(userAgent, clientDevice);
            const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

            user.lastLogin = now;
            user.lastDevice = detectedDev;
            if (!user.deviceSessions) user.deviceSessions = [];
            user.deviceSessions.unshift({
                deviceType: detectedDev.split(' (')[0] || 'PC / Desktop',
                os: clientOS || detectedDev,
                browser: clientBrowser || userAgent.substring(0, 40),
                ip: clientIp,
                loginTime: now
            });
            if (user.deviceSessions.length > 20) user.deviceSessions.length = 20;

            await db.updateUser(user.id, {
                lastLogin: now,
                lastDevice: detectedDev,
                deviceSessions: user.deviceSessions
            });

            await db.addLog({
                username: user.username,
                userFullName: user.name,
                role: user.roleName || user.role,
                action: 'USER_LOGIN',
                deviceType: detectedDev,
                ip: clientIp,
                details: `Successful login to LMS Admin Portal from ${detectedDev}`
            });

            const safeUser = { ...user };
            delete safeUser.password;

            return sendJson(res, 200, {
                status: 'success',
                message: `Welcome back, ${user.name}!`,
                user: safeUser,
                token: 'lms_token_' + Buffer.from(`${user.username}:${Date.now()}`).toString('base64'),
                deviceInfo: {
                    deviceType: detectedDev,
                    ip: clientIp,
                    loginTime: now
                }
            });
        }

        // =========================================================================
        // 3. MULTI-USER ROSTER & PRIVILEGE MANAGEMENT API (/api/users)
        // =========================================================================
        if (pathname === '/api/users' && method === 'GET') {
            const users = await db.getUsers();
            return sendJson(res, 200, users);
        }

        if (pathname === '/api/users' && method === 'POST') {
            const body = await parseBody(req);
            if (!body.username || !body.name || !body.password) {
                return sendJson(res, 400, { error: 'Username, password, and full name are required.' });
            }

            const cleanUser = body.username.trim().toLowerCase();
            const existing = await db.getUserByUsername(cleanUser);
            if (existing) {
                return sendJson(res, 409, { error: `Username '${cleanUser}' already exists.` });
            }

            const newUser = await db.createUser(body);

            await db.addLog({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'USER_CREATE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Created new admin user '${newUser.username}' (${newUser.name}) with role '${newUser.role}'`
            });

            const allUsers = await db.getUsers();
            return sendJson(res, 201, { status: 'success', user: newUser, users: allUsers });
        }

        if (pathname.startsWith('/api/users/') && method === 'PUT') {
            const targetIdOrUser = pathname.replace('/api/users/', '').trim();
            const body = await parseBody(req);
            const updated = await db.updateUser(targetIdOrUser, body);

            if (!updated) {
                return sendJson(res, 404, { error: `User '${targetIdOrUser}' not found.` });
            }

            await db.addLog({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'USER_UPDATE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Updated user profile/privileges for '${updated.username}'`
            });

            const allUsers = await db.getUsers();
            return sendJson(res, 200, { status: 'success', user: updated, users: allUsers });
        }

        if (pathname.startsWith('/api/users/') && method === 'DELETE') {
            const targetIdOrUser = pathname.replace('/api/users/', '').trim();
            const userToDelete = await db.getUserById(targetIdOrUser);

            if (!userToDelete) {
                return sendJson(res, 404, { error: `User '${targetIdOrUser}' not found.` });
            }

            // Prevent deleting the primary super admin
            if (userToDelete.username === 'laknath' || userToDelete.username === 'sheshadi' || userToDelete.username === 'wathisha') {
                return sendJson(res, 403, { error: 'Cannot delete primary owner/super-administrator account.' });
            }

            await db.deleteUser(targetIdOrUser);

            await db.addLog({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'USER_DELETE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Deleted user '${userToDelete.username}' (${userToDelete.name})`
            });

            const allUsers = await db.getUsers();
            return sendJson(res, 200, { status: 'success', message: 'User deleted', users: allUsers });
        }

        // =========================================================================
        // 4. STUDENT DATABASE API (/api/students)
        // =========================================================================
        if (pathname === '/api/students' && method === 'GET') {
            const students = await db.getStudents();
            return sendJson(res, 200, students);
        }

        if (pathname === '/api/students' && method === 'POST') {
            const body = await parseBody(req);
            if (!Array.isArray(body)) {
                return sendJson(res, 400, { error: 'Payload must be an array of student records.' });
            }

            await db.saveStudents(body);

            await db.addLog({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Teacher / Admin',
                role: 'Educator',
                action: 'STUDENTS_SYNC',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: `Synchronized student database with ${body.length} records.`
            });

            return sendJson(res, 200, { status: 'success', message: 'Students database updated successfully!', count: body.length });
        }

        if (pathname.startsWith('/api/students/') && method === 'GET') {
            const id = pathname.replace('/api/students/', '').trim();
            const student = await db.getStudentById(id);
            if (student) {
                return sendJson(res, 200, student);
            }
            return sendJson(res, 404, { error: `Student with ID '${id}' not found.` });
        }

        // =========================================================================
        // 5. MASTER ERP CONFIG API (/api/config)
        // =========================================================================
        if (pathname === '/api/config' && method === 'GET') {
            const config = await db.getConfig();
            return sendJson(res, 200, config);
        }

        if (pathname === '/api/config' && method === 'POST') {
            const body = await parseBody(req);
            await db.saveConfig(body);

            await db.addLog({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Teacher / Admin',
                role: 'Super Admin',
                action: 'CONFIG_UPDATE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: 'Updated global LMS ERP configuration.'
            });

            return sendJson(res, 200, { status: 'success', message: 'ERP Configuration updated successfully!' });
        }

        // =========================================================================
        // 6. TEACHER VAULT DOCUMENTS API (/api/documents)
        // =========================================================================
        if (pathname === '/api/documents' && method === 'GET') {
            const docs = await db.getDocuments();
            return sendJson(res, 200, docs);
        }

        if (pathname === '/api/documents' && method === 'POST') {
            const body = await parseBody(req);
            if (Array.isArray(body)) {
                await db.saveDocuments(body);
            } else {
                await db.saveDocument(body);
            }

            await db.addLog({
                username: req.headers['x-admin-user'] || 'teacher',
                userFullName: 'Educator',
                role: 'Teacher',
                action: 'DOCUMENT_UPLOAD',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: 'Uploaded / updated teacher confidential vault document.'
            });

            const docs = await db.getDocuments();
            return sendJson(res, 200, { status: 'success', documents: docs });
        }

        // =========================================================================
        // 7. MULTI-DEVICE ACTIVITY LOGS API (/api/logs)
        // =========================================================================
        if (pathname === '/api/logs' && method === 'GET') {
            const logs = await db.getLogs();
            return sendJson(res, 200, logs);
        }

        if (pathname === '/api/logs' && method === 'POST') {
            const body = await parseBody(req);
            const newLog = await db.addLog(body);
            return sendJson(res, 201, { status: 'success', log: newLog });
        }

        // =========================================================================
        // 8. DATABASE EXPORT & RESTORE BUNDLE API (/api/db/export & /api/db/import)
        // =========================================================================
        if (pathname === '/api/db/export' && method === 'GET') {
            const fullDb = await db.exportFullDb();
            return sendJson(res, 200, fullDb);
        }

        if (pathname === '/api/db/import' && method === 'POST') {
            const body = await parseBody(req);
            await db.importFullDb(body);

            await db.addLog({
                username: req.headers['x-admin-user'] || 'system',
                userFullName: 'Administrator',
                role: 'Super Admin',
                action: 'DATABASE_RESTORE',
                deviceType: detectDevice(userAgent, req.headers['x-device-type']),
                ip: clientIp,
                details: 'Full LMS database restored from archive.'
            });

            return sendJson(res, 200, { status: 'success', message: 'Full database bundle restored successfully!' });
        }

        // =========================================================================
        // 9. STATIC FILE SERVING WITH RESPONSIVE HEADERS & 404 FALLBACK
        // =========================================================================
        let requestedFile = pathname === '/' ? 'index.html' : pathname;
        requestedFile = requestedFile.replace(/^\/+/, '');
        let filePath = path.join(__dirname, requestedFile);

        // Prevent directory traversal attacks
        if (!filePath.startsWith(__dirname)) {
            res.writeHead(403, { 'Content-Type': 'text/plain' });
            res.end('Access Denied');
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        fs.readFile(filePath, (err, content) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.readFile(path.join(__dirname, '404.html'), (err404, content404) => {
                        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
                        res.end(content404 || '<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 Not Found</h1><p>Requested file does not exist on Science LMS Server.</p><a href="/">Back to Home</a></body></html>');
                    });
                } else {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end(`Server Error: ${err.code}`);
                }
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache',
                    'X-Content-Type-Options': 'nosniff'
                });
                res.end(content);
            }
        });
    } catch (apiErr) {
        console.error('Server Request Error:', apiErr);
        sendJson(res, 500, { error: apiErr.message || 'Internal Server Error' });
    }
});

// Initialize database connection & start server
db.init().then(() => {
    server.listen(PORT, HOST, () => {
        const networkIps = getNetworkIps();
        console.log('============================================================================');
        console.log(' Science with Laknath ERP - Cloud-Ready Multi-User Server');
        console.log('============================================================================');
        console.log(` Status: Server running on port ${PORT}`);
        console.log(` Local Access:        http://localhost:${PORT}`);
        networkIps.forEach(ip => {
            console.log(` Multi-Device Access: http://${ip}:${PORT} (LAN / WiFi Devices)`);
        });
        console.log(' Active API Endpoints:');
        console.log(`  - System Health:     http://localhost:${PORT}/api/status`);
        console.log(`  - Students DB:       http://localhost:${PORT}/api/students`);
        console.log(`  - System Config DB:  http://localhost:${PORT}/api/config`);
        console.log(`  - Admin Users DB:    http://localhost:${PORT}/api/users`);
        console.log(`  - Vault Docs DB:     http://localhost:${PORT}/api/documents`);
        console.log(`  - Activity Logs DB:  http://localhost:${PORT}/api/logs`);
        console.log(`  - DB Export / Backup:http://localhost:${PORT}/api/db/export`);
        console.log('============================================================================');
    });
}).catch(err => {
    console.error('Fatal initialization error:', err);
    process.exit(1);
});
