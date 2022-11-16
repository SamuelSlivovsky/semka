const database = require("../database/Database");

async function getOddelenia() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM oddelenie`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOddelenia
}