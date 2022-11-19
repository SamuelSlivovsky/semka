const database = require("../database/Database");

async function getLozka() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM lozko`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLozka
}