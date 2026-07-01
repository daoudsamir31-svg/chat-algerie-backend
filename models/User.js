const pool = require('../config/database');

class User {
    static async createTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS users (
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
        `;
        await pool.query(query);
        console.log('✅ Users table ready');
    }
}

module.exports = User; 
