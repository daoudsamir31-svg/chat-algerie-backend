const express = require('express');
const router = express.Router();

const pool = require('../config/database');


router.get('/', async(req,res)=>{

    try{

        const result = await pool.query(`

            SELECT 
            users.id,
            users.name,
            users.email,
            users.city,
            user_status.online,
            user_status.last_seen

            FROM users

            INNER JOIN user_status

            ON users.id = user_status.user_id

            WHERE user_status.online = true

        `);


        res.json(result.rows);


    }catch(error){

        res.status(500).json({
            error:error.message
        });

    }

});


module.exports = router;