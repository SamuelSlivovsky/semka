const database = require("../database/Database");

async function getZdravotneZaznamy() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM zdravotny_zaznam`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getZdravotneZaznamy
}