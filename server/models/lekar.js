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

async function getPacienti(pid_lekara) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM os_udaje join pacient using(rod_cislo) join lekar_pacient using(id_pacienta) where id_lekara = :idaa_lekara`, { idaa_lekara: pid_lekara }
        );
        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getPriemernyVek() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select 
                (select sum(vek) from
                (select extract(year from sysdate) - extract(year from datum_narodenia) as vek
                from (select to_date(substr(rod_cislo, 5, 2) || '.' || (case when substr(rod_cislo, 3, 1) = '5' then '0' when substr(rod_cislo, 3, 1) = '6' then '1' end) 
                || substr(rod_cislo, 4, 1) ||  '.19' || substr(rod_cislo, 1, 2), 'DD.MM.YYYY') as datum_narodenia
                from os_udaje join zamestnanec using(rod_cislo)
                join lekar using(id_zamestnanca)))) /
                (select count(distinct id_zamestnanca) from lekar) as priemerny_vek
             from dual`
        );
        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLekari,
    getPacienti,
    getPriemernyVek
}