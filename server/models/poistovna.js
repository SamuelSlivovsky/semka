const database = require("../database/Database");

async function getPoistovne() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM poistovna`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getPoistovne
}