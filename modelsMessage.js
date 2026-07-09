const pool = require('../config/database');

class Message {

    static async create(data) {

        const {
            user_id,
            room_id,
            receiver_id,
            content
        } = data;


        const result = await pool.query(
            `
            INSERT INTO messages
            (user_id, room_id, receiver_id, content)
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [
                user_id,
                room_id || null,
                receiver_id || null,
                content
            ]
        );


        return result.rows[0];

    }


    static async getRoomMessages(room_id){

        const result = await pool.query(
            `
            SELECT *
            FROM messages
            WHERE room_id=$1
            ORDER BY created_at ASC
            `,
            [room_id]
        );


        return result.rows;

    }

}


module.exports = Message;