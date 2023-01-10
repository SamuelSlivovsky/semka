const database = require("../database/Database");

async function getPoistenci() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM poistenec`,
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getPoistenci
}