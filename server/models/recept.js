const database = require("../database/Database");

async function getRecepty() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM recept`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getRecepty
}