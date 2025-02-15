// db.js
const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL Connection Pool
const pool = new Pool({
    user: process.env.POSTGRES_USER,     // PostgreSQL username
    host: process.env.POSTGRES_HOST,     // PostgreSQL host (use Railway DB host if deployed)
    database: process.env.POSTGRES_DB,   // Database name
    password: process.env.POSTGRES_PASSWORD, // Database password
    port: process.env.POSTGRES_PORT || 5000, // Default PostgreSQL port
});

pool.on('connect', () => {
    console.log('📦 Connected to PostgreSQL database!');
});

pool.on('error', (err) => {
    console.error('❌ PostgreSQL Database Error:', err);
});

module.exports = pool;
