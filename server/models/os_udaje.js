const database = require("../database/Database");

async function getOsobneUdaje() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM os_udaje`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getMenovciPacientLekar() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select p.meno, p.priezvisko as priezvisko_pacient, l.priezvisko as priezvisko_lekar 
                    from lekar_pacient join pacient using(id_pacienta)
                    join os_udaje p on(p.rod_cislo = pacient.rod_cislo)
                    join lekar using(id_lekara)
                    join zamestnanec using(id_zamestnanca)
                    join os_udaje l on(l.rod_cislo = zamestnanec.rod_cislo)
                where p.meno = l.meno`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getPomerMuziZeny() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select round(zeny) as zeny, round(100-zeny) as muzi from
            (select count(case when (substr(rod_cislo, 3, 1)) in ('5','6') then 1 else null end)/count(*)*100 as zeny
                from os_udaje join pacient using(rod_cislo))`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOsobneUdaje,
    getMenovciPacientLekar,
    getPomerMuziZeny
}