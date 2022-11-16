const database = require("../database/Database");

async function getOkresy() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM okres`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOkresy
}