const database = require("../database/Database");

async function getOperacie() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM operacia`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOperacie
}