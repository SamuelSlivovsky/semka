const database = require("../database/Database");

async function getSestricky() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM sestricka`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getSestricky
}