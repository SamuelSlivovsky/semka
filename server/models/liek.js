const database = require("../database/Database");

async function getLieky() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM liek`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLieky
}