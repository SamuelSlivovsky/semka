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

//TODO
async function insertOperacia(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        operacia_insert(:id_miestnosti, :id_zaznamu, :trvanie, :datum, :datum_vyzdvihnutia);
      END;`;

        let result = await conn.execute(sqlStatement,
            {
                id_lieku: body.id_lieku,
                id_pacienta: body.id_pacienta,
                id_lekara: body.id_lekara,
                datum: body.datum,
                datum_vyzdvihnutia: body.datum_vyzdvihnutia
            }
        );

        console.log("Rows inserted " + result.rowsAffected);

    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    getZdravotneZaznamy,
    insertOperacia
}