const database = require("../database/Database");

async function getTypyMiestnosti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM typ_miestnosti`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getTypyMiestnosti
}