const database = require("../database/Database");

async function insertPriloha(blob) {
    try {
        let conn = await database.getConnection();

        const result = await conn.execute(
            `INSERT INTO priloha(priloha) VALUES (:blob)`,
            { blob: blob }  // type and direction are optional for IN binds
        );

        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    insertPriloha
}