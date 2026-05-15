const { Pool } = require('pg');

// 1. Fail-Fast Security Check
// Prevents the app from running if the database URL is missing
if (!process.env.DATABASE_URL) {
    console.error('CRITICAL ERROR: DATABASE_URL is not defined in the environment variables.');
    process.exit(1);
}

// 2. Initialize Secure Connection Pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,

    // SSL is required by Supabase. 
    // rejectUnauthorized: false is standard for cloud managed DBs like Supabase 
    // when using the pg driver, to prevent certificate validation errors.
    ssl: {
        rejectUnauthorized: false
    },

    // Pool sizing and timeouts to prevent connection exhaustion attacks/leaks
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection could not be established
});

// 3. Global Error Handler for Idle Clients
// Prevents the Node.js process from crashing completely if an idle connection drops
pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client:', err.message);
    // You can choose not to process.exit(-1) here in production so the server stays alive,
    // but logging the error is mandatory for security auditing.
});

// 4. Export standard query method and client connector
module.exports = {
    // Standard query method (automatically returns connections to the pool)
    query: (text, params) => pool.query(text, params),

    // Your friend's original name (keep this so you don't break their other code)
    getClient: () => pool.connect(),

    // The name the Admin controller is looking for (add this!)
    connect: () => pool.connect()
};