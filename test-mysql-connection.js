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
const db = require('./db');

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
    const port = process.env.DB_PORT || '4000';
    const user = process.env.DB_USER || '287vGtA52xzWe45.root';
    const dbName = process.env.DB_NAME || 'test';
    const isTiDB = host.includes('tidbcloud.com') || (process.env.MYSQL_URI && process.env.MYSQL_URI.includes('tidbcloud.com'));
    const clusterName = process.env.TIDB_CLUSTER_NAME || (isTiDB ? 'ics-school-cluster' : 'Custom MySQL');

    console.log('============================================================================');
    console.log(` 🚀 TiDB Cloud (${clusterName}) / MySQL Connection Diagnostic`);
    console.log('============================================================================');
    console.log(` Target Provider: ${isTiDB ? 'TiDB Cloud Serverless' : 'MySQL Cloud Database'}`);
    console.log(` Cluster Name:    ${clusterName}`);
    console.log(` DB_HOST:         ${host}`);
    console.log(` DB_PORT:         ${port}`);
    console.log(` DB_USER:         ${user}`);
    console.log(` DB_NAME:         ${dbName}`);
    console.log(` DB_SSL:          ${process.env.DB_SSL || 'true'}`);
    console.log('----------------------------------------------------------------------------');

    try {
        const startTime = Date.now();
        await db.init();
        const latency = Date.now() - startTime;
        const status = await db.getStatus();

        if (status.isFallback || !status.connected || (!status.engine.includes('MySQL') && !status.engine.includes('TiDB'))) {
            console.error('❌ Cloud Database Connection Failed: Server fell back to local JSON storage.');
            console.log('----------------------------------------------------------------------------');
            console.log('🔍 TiDB Cloud Troubleshooting Checklist:');
            console.log('  1. Check DB_HOST: Ensure it matches gateway01.ap-southeast-1.prod.aws.tidbcloud.com');
            console.log('  2. Check DB_PORT: Must be 4000 for TiDB Cloud.');
            console.log('  3. Check DB_USER: Must include cluster prefix, e.g., 287vGtA52xzWe45.root');
            console.log('  4. Check DB_PASSWORD: Ensure password matches your cluster settings (Jw4G8J9vbkYFOBI3).');
            console.log('  5. Check TLS: TiDB Cloud public endpoint strictly requires DB_SSL=true.');
            console.log('  6. Check Firewall / IP Whitelist: In TiDB Cloud Console -> Security -> IP Access List,');
            console.log('     ensure 0.0.0.0/0 (or your public IP) is allowed for public access.');
            console.log('============================================================================');
            process.exit(1);
        }

        console.log('✅ Connection Status: ONLINE');
        console.log(`⚡ Round-Trip Latency: ${latency} ms`);
        console.log(`☁️  Active Engine:      ${status.engine}`);
        if (status.cluster) console.log(`🏷️  Cluster Name:       ${status.cluster}`);
        console.log('📊 Active Database State & Statistics:');
        console.log(JSON.stringify(status, null, 2));
        console.log('============================================================================');
        console.log('🎉 TiDB Cloud Database is fully operational and ready for production!');
        console.log('============================================================================');
        process.exit(0);
    } catch (e) {
        console.error('❌ Database Connection Test Failed:', e.message);
        console.log('----------------------------------------------------------------------------');
        console.log('🔍 Troubleshooting Tips for TiDB Cloud:');
        console.log('  1. Verify credentials in .env match the TiDB Cloud Console.');
        console.log('  2. Confirm your environment has internet connectivity to gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000.');
        console.log('  3. Ensure DB_SSL=true is set.');
        console.log('============================================================================');
        process.exit(1);
    }
}

runDiagnostic();
