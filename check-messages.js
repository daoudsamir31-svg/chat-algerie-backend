const pool = require('./config/database');

async function check() {
    try {
        const result = await pool.query(`
            SELECT column_name
            FROM information_schema.columns
            WHERE table_name = 'messages';
        `);

        console.log(result.rows);

    } catch (error) {
        console.error(error);

    } finally {
        pool.end();
    }
}

check();