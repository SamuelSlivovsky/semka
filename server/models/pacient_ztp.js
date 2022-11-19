const database = require("../database/Database");

async function getPacientiZtp() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM pacient_ztp`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getPacientiZtp
}