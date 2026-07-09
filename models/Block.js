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

}

module.exports = Block;