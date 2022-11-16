const database = require("../database/Database");

async function getLekari() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM lekar`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getPacienti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM os_udaje join pacient using(rod_cislo) join lekar_pacient using(id_pacienta) where id_lekara = 1`,
        );

        //console.log(result.rows);
        return result.rows;

    } catch(err) {
        console.log(err);
    }   
}

module.exports = {
    getLekari,
    getPacienti
}