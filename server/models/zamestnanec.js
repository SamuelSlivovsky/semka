const database = require("../database/Database");

async function getZamestnanci() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM zamestnanec`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getZamestnanci
}