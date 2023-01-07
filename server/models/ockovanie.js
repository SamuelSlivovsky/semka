const database = require("../database/Database");
const oracledb = database.oracledb;

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