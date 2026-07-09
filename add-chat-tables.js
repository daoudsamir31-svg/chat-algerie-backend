const pool = require('./config/database');

async function createChatTables() {
    try {

        await pool.query(`

        CREATE TABLE IF NOT EXISTS rooms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );


        CREATE TABLE IF NOT EXISTS room_users (
            id SERIAL PRIMARY KEY,
            room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE(room_id, user_id)
        );


        CREATE TABLE IF NOT EXISTS private_messages (
            id SERIAL PRIMARY KEY,
            sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );


        CREATE TABLE IF NOT EXISTS blocks (
            id SERIAL PRIMARY KEY,
            blocker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            blocked_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(blocker_id, blocked_id)
        );

        `);

        console.log("✅ Chat tables created");

    } catch(error) {
        console.error(error);
    } finally {
        pool.end();
    }
}

createChatTables();