const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function test() {
  try {
    const result = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables
      WHERE table_schema='public';
    `);

    console.log("Tables:");
    console.log(result.rows);

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

test();