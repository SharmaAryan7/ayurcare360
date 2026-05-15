require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../src/config/db');

async function runMigrations() {
    try {
        console.log('Connecting to PostgreSQL to check migration status...');

        // 1. Create a tracking table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS migration_history (
                id SERIAL PRIMARY KEY,
                migration_name VARCHAR(255) UNIQUE NOT NULL,
                executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // 2. Fetch the list of migrations that have ALREADY been executed
        const { rows } = await db.query('SELECT migration_name FROM migration_history;');
        const executedMigrations = rows.map(row => row.migration_name);

        // Since you already ran 01_init_schema.sql manually before we added this tracking table,
        // we need to inject it into the history so the script knows to skip it.
        if (!executedMigrations.includes('01_init_schema.sql')) {
            console.log('Marking 01_init_schema.sql as already executed...');
            await db.query("INSERT INTO migration_history (migration_name) VALUES ('01_init_schema.sql') ON CONFLICT DO NOTHING");
            executedMigrations.push('01_init_schema.sql');
        }

        // 3. Read the migrations directory
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir);

        // 4. Filter for ONLY new, un-run migration files
        const pendingMigrations = files
            .filter(file => file.match(/^\d+_.+\.sql$/)) // Only numbered SQL files
            .filter(file => !executedMigrations.includes(file)) // SKIP files already in history
            .sort(); // Run them in alphabetical/numerical order

        if (pendingMigrations.length === 0) {
            console.log('No new migrations to run. Database is up to date!');
            return;
        }

        // 5. Execute pending migrations safely
        for (const file of pendingMigrations) {
            const sqlFilePath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(sqlFilePath, 'utf8');

            console.log(`Executing new migration: ${file}...`);

            // Use a transaction: if the script fails halfway, it undoes the changes
            await db.query('BEGIN');
            try {
                await db.query(sql);
                // Record that this file was successfully run
                await db.query('INSERT INTO migration_history (migration_name) VALUES ($1)', [file]);
                await db.query('COMMIT');
                console.log(`Success: ${file} applied and recorded.`);
            } catch (err) {
                await db.query('ROLLBACK');
                throw new Error(`Failed to execute ${file}: ${err.message}`);
            }
        }

        console.log('Success: All pending database migrations have been executed successfully.');
    } catch (error) {
        console.error('Critical Failure during migration:', error);
    } finally {
        process.exit();
    }
}

runMigrations();