const database = require("../database/Database");

async function getChoroby() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM choroba`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getChoroby
}