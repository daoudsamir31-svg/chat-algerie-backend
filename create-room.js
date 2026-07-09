const pool = require('./config/database');

async function createRoom(){

    try{

        await pool.query(`
            INSERT INTO rooms (name)
            VALUES ('الجزائر')
            ON CONFLICT (name) DO NOTHING;
        `);

        console.log("✅ Default room created");

    }catch(error){

        console.error(error);

    }finally{

        pool.end();

    }

}

createRoom();