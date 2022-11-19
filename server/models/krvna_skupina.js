const database = require("../database/Database");

async function getKrvneSkupiny() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM krvna_skupina`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getKrvneSkupiny
}