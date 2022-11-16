const database = require("../database/Database");

async function getHospitalizacie() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM hospitalizacia`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getHospitalizacie
}