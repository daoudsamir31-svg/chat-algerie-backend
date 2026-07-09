const pool = require('./config/database');

async function check(){

    try{

        const result = await pool.query(
            "SELECT * FROM user_status"
        );

        console.log("Rows count:", result.rows.length);
        console.log(result.rows);

    }catch(error){

        console.log("ERROR:", error.message);

    }finally{

        await pool.end();

    }

}

check();