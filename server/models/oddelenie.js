const database = require("../database/Database");

async function getOddelenia() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM oddelenie`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getTopZamestnanciVyplatyPocet(pocet) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select nazov_nemocnice, nazov_oddelenia, listagg(mpz, ', ')
            within group(order by zarobok desc)
                from (select nazov_nemocnice, nazov_oddelenia, mpz, zarobok 
                    from (select nem.nazov as nazov_nemocnice,
                             tod.nazov as nazov_oddelenia, meno || ' ' || priezvisko || ' - ' || sum(suma) || ' eur' as mpz, sum(suma) as zarobok,
                                dense_rank() over(partition by od.id_oddelenia order by sum(suma) desc) as poradie
                                    from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                                   join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                                    join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                                     join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                                      join vyplata@db_link_vyplaty vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                                       where zam.id_zamestnanca in(select id_zamestnanca from lekar)
                                                        group by nem.id_nemocnice, nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia)
                                  where poradie <= :pocet)                               
                 group by nazov_nemocnice, nazov_oddelenia`, [pocet]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getZamestnanciOddeleni() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select n.nazov as nazov_nemocnice, typ.nazov as nazov_oddelenia,
                    listagg(ou.meno || ' ' || ou.priezvisko, ', ') within group (order by ou.priezvisko) as "Zamestnanci"
            from oddelenie o join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
                            join nemocnica n on (n.id_nemocnice = o.id_nemocnice)
                            join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
                            join os_udaje ou on (z.rod_cislo = ou.rod_cislo)
            group by n.nazov, n.id_nemocnice, typ.nazov, o.id_oddelenia`
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOddelenia,
    getTopZamestnanciVyplatyPocet,
    getZamestnanciOddeleni
}