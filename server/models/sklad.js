const database = require("../database/Database");

async function getSklady() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM sklad`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getSklady
}