const database = require("../database/Database");

async function getZoznamChorob() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM zoznam_chorob`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function insertZoznamChorob(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        zoznam_chorob_insert(:rod_cislo, :id_choroby, :datum_od, :datum_do);
        END;`;

        await conn.execute(sqlStatement,
            {
                rod_cislo: body.rod_cislo,
                id_choroby: body.id_choroby,
                datum_od: body.datum_od,
                datum_do: body.datum_do
            }
        );

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getZoznamChorob,
    insertZoznamChorob
}