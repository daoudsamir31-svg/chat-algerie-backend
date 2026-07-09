const pool = require('./config/database');

async function create(){

    try{

        await pool.query(`
            CREATE TABLE IF NOT EXISTS user_status (

                id SERIAL PRIMARY KEY,

                user_id INTEGER UNIQUE
                REFERENCES users(id)
                ON DELETE CASCADE,

                socket_id VARCHAR(255),

                online BOOLEAN DEFAULT false,

                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP

            );
        `);

        console.log("✅ User status table created");


    }catch(error){

        console.error(error);

    }finally{

        pool.end();

    }

}

create();