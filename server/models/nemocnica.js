const database = require("../database/Database");

async function getNemocnice() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM nemocnica`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getNemocnice
}