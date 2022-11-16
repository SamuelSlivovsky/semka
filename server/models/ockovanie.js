const database = require("../database/Database");

async function getOckovania() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM ockovanie`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOckovania
}