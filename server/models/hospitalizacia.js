const database = require("../database/Database");

async function getHospitalizacie() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM hospitalizacia`,
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

async function insertHospitalizacia(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        hospitalizacia_insert(:rod_cislo , :priloha, :popis , :datum,  :id_lekara, :dat_do);
        END;`;

        let result = await conn.execute(sqlStatement,
            {
                rod_cislo: body.rod_cislo,
                priloha: body.priloha,
                popis: body.popis,
                datum: body.datum,
                id_lekara: body.id_lekara,
                dat_do: body.dat_do
            }
        );
        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getHospitalizacie,
    insertHospitalizacia
}