const database = require("../database/Database");

async function getMiestnosti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM miestnost`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getMiestnosti
}