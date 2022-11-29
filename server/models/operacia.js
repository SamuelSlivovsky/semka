const database = require("../database/Database");

async function getOperacie() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM operacia`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getOperaciePocetLekarovTrvanie(pocetLekarov, trvanie) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select id_operacie, trvanie, count(id_lekara) as pocet_lekarov
                from operacia_lekar join operacia using(id_operacie)
                group by id_operacie, trvanie
                having count(id_lekara) > :pocet_lekarov and trvanie > :trvanie
                order by trvanie desc`, [pocetLekarov, trvanie]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOperacie,
    getOperaciePocetLekarovTrvanie
}