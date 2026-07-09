const express = require('express');
const router = express.Router();

const pool = require('../config/database');


// جميع المستخدمين مع الحالة
router.get('/', async (req,res)=>{

    try{

        const result = await pool.query(`

            SELECT

            users.id,
            users.name,
            users.email,
            users.gender,
            users.age,
            users.city,
            users.profile_pic,

            COALESCE(user_status.online,false) AS online,
            user_status.last_seen


            FROM users

            LEFT JOIN user_status

            ON users.id = user_status.user_id


            ORDER BY users.id DESC

        `);


        res.json(result.rows);


    }catch(error){

        console.log(error.message);

        res.status(500).json({
            error:error.message
        });

    }

});


module.exports = router;