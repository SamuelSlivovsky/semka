const database = require("../database/Database");

async function getVysetrenia() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM vysetrenie`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getVysetrenia
}