const database = require("../database/Database");

async function getLekariPacienti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM lekar_pacient`,
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getLekariPacienti
}