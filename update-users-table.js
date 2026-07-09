const pool = require('./config/database');

async function updateTable() {
    try {
        await pool.query(`
            DROP TABLE IF EXISTS users CASCADE;

            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                gender VARCHAR(10),
                age INTEGER,
                city VARCHAR(100),
                bio TEXT,
                profile_pic VARCHAR(255),
                is_verified BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("✅ Users table updated successfully");

    } catch(error) {
        console.error(error);
    } finally {
        pool.end();
    }
}

updateTable();