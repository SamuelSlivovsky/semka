const database = require("../database/Database");

async function getOsobneUdaje() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM os_udaje`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOsobneUdaje
}