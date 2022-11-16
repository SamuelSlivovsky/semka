const database = require("../database/Database");
const oracleConnection = database.oracledb;

async function getAll() {
    try {
        let conn = await oracleConnection.getConnection();
        const result = await conn.execute(
            `SELECT * FROM kraj`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getAll
}