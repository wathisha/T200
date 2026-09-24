/**
 * ============================================================================
 * Science with Laknath ERP - JSON to Cloud MySQL Migration Tool
 * ============================================================================
 * Usage:
 *   node migrate-json-to-mysql.js
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const db = require('./db');

try {
    require('dotenv').config();
} catch (e) {}

async function runMigration() {
    console.log('============================================================================');
    console.log(' Science with Laknath ERP - Database Migration to Cloud MySQL');
    console.log('============================================================================');
    console.log(` Target Host: ${process.env.DB_HOST || 'localhost'}`);
    console.log(` Database:    ${process.env.DB_NAME || 'science_lms_db'}`);
    console.log(` SSL Mode:    ${process.env.DB_SSL || 'false'}`);
    console.log('----------------------------------------------------------------------------');

    try {
        console.log('⏳ Initializing connection and verifying schema...');
        await db.init();

        const dataDir = path.join(__dirname, 'assets', 'data');
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
        console.log('🎉 Migration Completed Successfully!');
        const status = await db.getStatus();
        console.log('📊 Verification Database Summary:', status);
        console.log('============================================================================');
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Failed:', err);
        process.exit(1);
    }
}

runMigration();
