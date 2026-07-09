const pool = require('../config/database');

class Message {

    static async create(data){

        const result = await pool.query(
            `
            INSERT INTO messages
            (
                user_id,
                receiver_id,
                room_id,
                content
            )

            VALUES
            ($1,$2,$3,$4)

            RETURNING *
            `,
            [
                data.user_id || data.sender_id,
                data.receiver_id || null,
                data.room_id || null,
                data.content
            ]
        );

        return result.rows[0];

    }



    static async private(user1,user2){

        const result = await pool.query(

            `
            SELECT *

            FROM messages

            WHERE

            (user_id=$1 AND receiver_id=$2)

            OR

            (user_id=$2 AND receiver_id=$1)

            ORDER BY created_at ASC

            `,

            [
                user1,
                user2
            ]

        );


        return result.rows;

    }


}


module.exports = Message;