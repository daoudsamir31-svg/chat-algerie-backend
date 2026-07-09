const express = require('express');
const router = express.Router();

const pool = require('../config/database');


// ===============================
// Get all rooms
// ===============================
router.get('/rooms', async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT *
            FROM rooms
            ORDER BY id ASC
        `);

        res.json(result.rows);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



// ===============================
// Create new room
// ===============================
router.post('/rooms', async (req, res) => {

    try {

        const { name } = req.body;


        const result = await pool.query(
            `
            INSERT INTO rooms(name)
            VALUES($1)
            RETURNING *
            `,
            [name]
        );


        res.json(result.rows[0]);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




// ===============================
// Get room messages
// ===============================
router.get('/messages/:room_id', async (req, res) => {

    try {

        const { room_id } = req.params;


        const result = await pool.query(
            `
            SELECT *
            FROM messages

            WHERE room_id=$1

            ORDER BY created_at ASC
            `,
            [room_id]
        );


        res.json(result.rows);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




// ===============================
// Get private messages
// ===============================
router.get('/private/:user1/:user2', async (req, res) => {

    try {


        const {
            user1,
            user2
        } = req.params;



        const result = await pool.query(

            `
            SELECT *

            FROM messages

            WHERE

            (
                user_id=$1
                AND
                receiver_id=$2
            )

            OR

            (
                user_id=$2
                AND
                receiver_id=$1
            )


            ORDER BY created_at ASC

            `,

            [
                user1,
                user2
            ]

        );



        res.json(result.rows);



    } catch(error) {


        console.log(error.message);


        res.status(500).json({

            error:error.message

        });


    }

});





// ===============================
// Send private message by API
// ===============================
router.post('/private', async(req,res)=>{


    try {


        const {
            sender_id,
            receiver_id,
            content
        } = req.body;



        const result = await pool.query(

            `
            INSERT INTO messages
            (
                user_id,
                receiver_id,
                content
            )

            VALUES
            ($1,$2,$3)

            RETURNING *

            `,

            [
                sender_id,
                receiver_id,
                content
            ]

        );



        res.json(result.rows[0]);



    } catch(error){


        console.log(error.message);


        res.status(500).json({

            error:error.message

        });


    }


});



module.exports = router;