const database = require("../database/Database");

async function getPacienti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM pacient`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getPacienti
}