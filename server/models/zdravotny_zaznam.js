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

async function insertHospitalizacia(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        hospitalizacia_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_lekara, :id_lozka, :id_sestricky, :dat_do);
        END;`;

        await conn.execute(sqlStatement,
            {
                rod_cislo: body.rod_cislo,
                id_prilohy: body.id_prilohy,
                popis: body.popis,
                datum: body.datum,
                id_lekara: body.id_lekara,
                id_lozka: body.id_lozka,
                id_sestricky: body.id_sestricky,
                dat_do: body.dat_do,
            }
        );

    } catch (err) {
        console.log(err);
    }
}

async function insertOperacia(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        operacia_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_miestnosti, :trvanie);
        END;`;

        await conn.execute(sqlStatement,
            {
                rod_cislo: body.rod_cislo,
                id_prilohy: body.id_prilohy,
                popis: body.popis,
                datum: body.datum,
                id_miestnosti: body.id_miestnosti,
                trvanie: body.trvanie
            }
        );

    } catch (err) {
        console.log(err);
    }
}

async function insertVysetrenie(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        vysetrenie_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_lekara);
        END;`;

        await conn.execute(sqlStatement,
            {
                rod_cislo: body.rod_cislo,
                id_prilohy: body.id_prilohy,
                popis: body.popis,
                datum: body.datum,
                id_lekara: body.id_lekara
            }
        );

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getZdravotneZaznamy,
    insertOperacia,
    insertHospitalizacia,
    insertVysetrenie
}