/**
 * ============================================================================
 * Independent Collective School (ICS) - TiDB Cloud Diagnostic Tool
 * Cluster: ics-school-cluster
 * ============================================================================
 * Usage:
 *   node test-mysql-connection.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');

// Auto-load environment variables (.env / .env.example) with zero-dependency fallback
try {
    require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (e) {}
try {
    const candidatePaths = [
        path.join(__dirname, '.env'),
        path.resolve(process.cwd(), '.env'),
        path.join(__dirname, '.env.example'),
        path.resolve(process.cwd(), '.env.example')
    ];
    for (const envPath of candidatePaths) {
        if (fs.existsSync(envPath)) {
            const raw = fs.readFileSync(envPath, 'utf8');
            const lines = raw.split(/\r?\n/);
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#')) continue;
                const eqIdx = trimmed.indexOf('=');
                if (eqIdx !== -1) {
                    const key = trimmed.slice(0, eqIdx).trim();
                    let val = trimmed.slice(eqIdx + 1).trim();
                    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                        val = val.slice(1, -1);
                    }
                    if (process.env[key] === undefined) {
                        process.env[key] = val;
                    }
                }
            }
            break;
        }
    }
} catch (err) {}

async function runDiagnostic() {
    const host = process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
    const port = parseInt(process.env.DB_PORT || '4000', 10);
    const user = process.env.DB_USER || '287vGtA52xzWe45.root';
    const password = process.env.DB_PASSWORD || 'Jw4G8J9vbkYF0BI3';
    const dbName = process.env.DB_NAME || 'test';
    const isTiDB = host.includes('tidbcloud.com') || (process.env.MYSQL_URI && process.env.MYSQL_URI.includes('tidbcloud.com'));

    console.log('============================================================================');
    console.log(' 🚀 TiDB Cloud Serverless / MySQL Connection Diagnostic');
    console.log('============================================================================');
    console.log(` Target Provider: ${isTiDB ? 'TiDB Cloud Serverless' : 'MySQL Cloud Database'}`);
    console.log(` DB_HOST:         ${host}`);
    console.log(` DB_PORT:         ${port}`);
    console.log(` DB_USER:         ${user}`);
    console.log(` DB_NAME:         ${dbName}`);
    console.log(` DB_SSL:          ${process.env.DB_SSL || 'true'}`);
    console.log('----------------------------------------------------------------------------');

    // 1. Check if mysql2 package is installed
    let mysql;
    try {
        mysql = require('mysql2/promise');
    } catch (pkgErr) {
        console.error('❌ Driver Missing: The `mysql2` package is not installed.');
        console.log('');
        console.log('💡 Quick Fix:');
        console.log('   Run: npm install');
        console.log('   (or: npm install mysql2 dotenv)');
        console.log('============================================================================');
        process.exit(1);
    }

    // 2. Perform direct raw connection attempt to catch exact MySQL / TLS / Network error
    console.log('⏳ Connecting directly to database cluster...');
    const startTime = Date.now();
    try {
        let connectionConfig = {
            host,
            port,
            user,
            password,
            database: dbName,
            ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: false },
            connectTimeout: 10000
        };

        const conn = await mysql.createConnection(connectionConfig);
        const [rows] = await conn.query('SELECT 1 + 1 AS result, VERSION() AS version');
        await conn.end();

        const latency = Date.now() - startTime;
        console.log('✅ Connection Status: ONLINE & AUTHENTICATED');
        console.log(`⚡ Round-Trip Latency: ${latency} ms`);
        console.log(`📦 Server Version:     ${rows[0].version}`);
        console.log('----------------------------------------------------------------------------');

        // Now test full db engine
        const db = require('./db');
        await db.init();
        const status = await db.getStatus();
        console.log('📊 Active Database State & Statistics:');
        console.log(JSON.stringify(status, null, 2));
        console.log('============================================================================');
        console.log('🎉 TiDB Cloud Database is fully operational and ready for production!');
        console.log('============================================================================');
        process.exit(0);
    } catch (err) {
        console.error('');
        console.error('❌ Connection Failed! Exact Error Details:');
        console.error(`   Error Code:    ${err.code || 'UNKNOWN'}`);
        console.error(`   Error Message: ${err.message}`);
        console.log('----------------------------------------------------------------------------');
        console.log('🔍 Pinpointed Solutions:');

        if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('  ⚠️  AUTHENTICATION ERROR:');
            console.log('     Username or Password does not match your TiDB cluster.');
            console.log('     1. Password check: In "Jw4G8J9vbkYF0BI3", verify if the 13th character is 0 (zero) -> Jw4G8J9vbkYF0BI3.');
            console.log('     2. Or reset your root password in TiDB Cloud Console -> Security -> Reset Password.');
        } else if (err.code === 'ETIMEDOUT' || err.code === 'ECONNREFUSED' || (err.message && err.message.includes('timeout'))) {
            console.log('  ⚠️  FIREWALL / NETWORK BLOCKED:');
            console.log('     TiDB Cloud is blocking your connection because your IP is not whitelisted.');
            console.log('     1. Go to https://tidbcloud.com and open your cluster.');
            console.log('     2. Go to "Security" -> "IP Access List".');
            console.log('     3. Add 0.0.0.0/0 (Allow access from anywhere) and save.');
            console.log('     4. Wait 10 seconds and re-run: npm run test:db');
        } else if (err.code === 'ENOTFOUND') {
            console.log('  ⚠️  DNS RESOLUTION FAILED:');
            console.log('     Check your internet connection and verify DB_HOST in .env.');
        } else {
            console.log('  1. Check TiDB Cloud Console -> Security -> IP Access List: add 0.0.0.0/0.');
            console.log('  2. Verify DB_USER (287vGtA52xzWe45.root) and DB_PASSWORD in .env.');
        }
        console.log('============================================================================');
        process.exit(1);
    }
}

runDiagnostic();
