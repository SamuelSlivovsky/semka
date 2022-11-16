const database = require("../database/Database");

async function getSarze() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM sarza`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getSarze
}