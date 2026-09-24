/**
 * ============================================================================
 * Independent Collective School (ICS) - TiDB Cloud Migration Tool
 * Cluster: ics-school-cluster
 * ============================================================================
 * Usage:
 *   node migrate-json-to-mysql.js
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

async function runMigration() {
    const host = process.env.DB_HOST || 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com';
    const port = process.env.DB_PORT || '4000';
    const user = process.env.DB_USER || '287vGtA52xzWe45.root';
    const dbName = process.env.DB_NAME || 'test';
    const isTiDB = host.includes('tidbcloud.com') || (process.env.MYSQL_URI && process.env.MYSQL_URI.includes('tidbcloud.com'));
    const clusterName = process.env.TIDB_CLUSTER_NAME || (isTiDB ? 'ics-school-cluster' : 'Custom MySQL');

    console.log('============================================================================');
    console.log(` 🚀 Science with Sheshadi LMS - Database Migration to ${isTiDB ? 'TiDB Cloud' : 'Cloud MySQL'}`);
    console.log('============================================================================');
    console.log(` Cluster:      ${clusterName}`);
    console.log(` Target Host:  ${host}`);
    console.log(` Database:     ${dbName}`);
    console.log(` SSL Mode:     ${process.env.DB_SSL || 'true'}`);
    console.log('----------------------------------------------------------------------------');

    try {
        console.log('⏳ Initializing connection and verifying schema...');
        await db.init();

        const status = await db.getStatus();
        if (status.isFallback || !status.connected || (!status.engine.includes('MySQL') && !status.engine.includes('TiDB'))) {
            console.error('❌ Migration Aborted: Cannot connect to TiDB Cloud / MySQL database. (Fell back to JSON mode)');
            console.error('   Please check your .env configuration and verify network access to TiDB Cloud.');
            process.exit(1);
        }

        const dataDir = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, 'assets', 'data');
        const usersFile = path.join(dataDir, 'users.json');
        const studentsFile = path.join(dataDir, 'students.json');
        const configFile = path.join(dataDir, 'erp-config.json');
        const docsFile = path.join(dataDir, 'teacher-docs.json');
        const logsFile = path.join(dataDir, 'activity-logs.json');

        // 1. Migrate Users
        if (fs.existsSync(usersFile)) {
            const users = JSON.parse(fs.readFileSync(usersFile, 'utf8'));
            console.log(`👥 Migrating ${users.length} user accounts...`);
            for (const u of users) {
                await db.createUser(u);
            }
            console.log('   ✅ Users migrated successfully.');
        }

        // 2. Migrate Students
        if (fs.existsSync(studentsFile)) {
            const students = JSON.parse(fs.readFileSync(studentsFile, 'utf8'));
            console.log(`🎓 Migrating ${students.length} student records...`);
            await db.saveStudents(students);
            console.log('   ✅ Students migrated successfully.');
        }

        // 3. Migrate ERP Config
        if (fs.existsSync(configFile)) {
            const config = JSON.parse(fs.readFileSync(configFile, 'utf8'));
            console.log('⚙️  Migrating global ERP configuration...');
            await db.saveConfig(config);
            console.log('   ✅ ERP Configuration migrated successfully.');
        }

        // 4. Migrate Teacher Docs
        if (fs.existsSync(docsFile)) {
            const docs = JSON.parse(fs.readFileSync(docsFile, 'utf8'));
            console.log(`📁 Migrating ${docs.length} teacher documents...`);
            await db.saveDocuments(docs);
            console.log('   ✅ Teacher documents migrated successfully.');
        }

        // 5. Migrate Activity Logs
        if (fs.existsSync(logsFile)) {
            const logs = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
            console.log(`📋 Migrating ${logs.length} activity log entries...`);
            for (const l of logs) {
                await db.addLog(l);
            }
            console.log('   ✅ Activity logs migrated successfully.');
        }

        console.log('----------------------------------------------------------------------------');
        console.log('🎉 Migration Completed Successfully to TiDB Cloud!');
        const finalStatus = await db.getStatus();
        console.log('📊 Verification Database Summary:', JSON.stringify(finalStatus, null, 2));
        console.log('============================================================================');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
}

runMigration();
