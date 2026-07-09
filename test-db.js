const pool = require('./config/database');

async function test() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log("✅ Connected!");
    console.log(result.rows);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    process.exit();
  }
}

test();