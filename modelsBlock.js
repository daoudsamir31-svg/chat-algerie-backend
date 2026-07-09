const pool = require('../config/database');

class Block {

    static async isBlocked(user1, user2) {

        const result = await pool.query(
            `
            SELECT *
            FROM blocks
            WHERE 
            (blocker_id=$1 AND blocked_id=$2)
            OR
            (blocker_id=$2 AND blocked_id=$1)
            `,
            [user1, user2]
        );

        return result.rows.length > 0;
    }


    static async create(blocker_id, blocked_id) {

        const result = await pool.query(
            `
            INSERT INTO blocks
            (blocker_id, blocked_id)
            VALUES ($1,$2)
            ON CONFLICT DO NOTHING
            RETURNING *
            `,
            [blocker_id, blocked_id]
        );

        return result.rows[0];
    }


    static async remove(blocker_id, blocked_id) {

        await pool.query(
            `
            DELETE FROM blocks
            WHERE blocker_id=$1
            AND blocked_id=$2
            `,
            [blocker_id, blocked_id]
        );

    }

}

module.exports = Block;