/**
 * ============================================================================
 * Science with Laknath ERP - MySQL Cloud Connection Diagnostic Tool
 * ============================================================================
 * Usage:
 *   node test-mysql-connection.js
 * ============================================================================
 */

const db = require('./db');

try {
    require('dotenv').config();
} catch (e) {}

async function runDiagnostic() {
    console.log('============================================================================');
    console.log(' Testing Cloud MySQL Connection & Health Diagnostic');
    console.log('============================================================================');
    console.log(` DB_HOST:     ${process.env.DB_HOST || '(not set - using localhost)'}`);
    console.log(` DB_PORT:     ${process.env.DB_PORT || '3306'}`);
    console.log(` DB_USER:     ${process.env.DB_USER || 'root'}`);
    console.log(` DB_NAME:     ${process.env.DB_NAME || 'science_lms_db'}`);
    console.log(` DB_SSL:      ${process.env.DB_SSL || 'false'}`);
    console.log('----------------------------------------------------------------------------');

    try {
        const startTime = Date.now();
        await db.init();
        const latency = Date.now() - startTime;
        const status = await db.getStatus();

        console.log('✅ Connection Status: ONLINE');
        console.log(`⚡ Round-Trip Latency: ${latency} ms`);
        console.log('📊 Active Database State:');
        console.log(JSON.stringify(status, null, 2));
        console.log('============================================================================');
        process.exit(0);
    } catch (e) {
        console.error('❌ Database Connection Test Failed:', e.message);
        console.log('----------------------------------------------------------------------------');
        console.log('🔍 Troubleshooting Tips:');
        console.log('  1. Check if DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME in .env are correct.');
        console.log('  2. For cloud providers (TiDB Cloud, Aiven), ensure DB_SSL=true is set.');
        console.log('  3. Ensure your cloud database firewall allows connections from 0.0.0.0/0.');
        console.log('============================================================================');
        process.exit(1);
    }
}

runDiagnostic();
