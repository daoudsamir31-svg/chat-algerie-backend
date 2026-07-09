const pool = require('./config/database');

async function updateMessages() {
    try {

        await pool.query(`
            ALTER TABLE messages
            ADD COLUMN IF NOT EXISTS room_id INTEGER REFERENCES rooms(id) ON DELETE CASCADE,
            ADD COLUMN IF NOT EXISTS receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE;
        `);

        console.log("✅ Messages table updated");

    } catch(error) {

        console.error(error);

    } finally {

        pool.end();

    }
}

updateMessages();