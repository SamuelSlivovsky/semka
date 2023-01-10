const database = require("../database/Database");

async function getMiestnosti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM miestnost`,
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getMiestnosti
}