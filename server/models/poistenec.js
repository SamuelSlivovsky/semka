const database = require("../database/Database");

async function getPoistenci() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM poistenec`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getPoistenci
}