const database = require("../database/Database");

async function getPacienti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM pacient`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getNajviacChoriPocet(pocet) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select meno, priezvisko, pocet_chorob from 
                    (select meno, priezvisko, count(*) as pocet_chorob, rank() over(order by count(*) desc) as poradie
                        from os_udaje join pacient using(rod_cislo)
                                join zoznam_chorob zo using(id_pacienta)
                                    group by meno, priezvisko, rod_cislo) s_out
                                    where poradie <= :pocet`, [pocet]
        );
        console.log(result.rows);
        return result.rows;

    } catch (err) {
        console.log(err);
    }
}


async function getNajviacOckovaniPercenta(percent) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select meno, priezvisko, pocet_operacii from
                (select meno, priezvisko, count(*) as pocet_operacii, rank() over(order by count(*) desc) as poradie
                     from os_udaje join pacient using(rod_cislo)
                                join zdravotny_zaznam using(id_pacienta)
                                 join operacia using(id_zaznamu)
                                  group by meno, priezvisko, rod_cislo)
                                   where poradie <= (:percent/100)*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                         join zdravotny_zaznam using(id_pacienta)
                                                                                          join operacia using(id_zaznamu))`, [percent]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getNajviacHospitalizovaniPercenta(percent) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select meno, priezvisko, pocet_hospitalizacii from
                (select meno, priezvisko, count(*) as pocet_hospitalizacii, rank() over(order by count(*) desc) as poradie
                    from os_udaje join pacient using(rod_cislo)
                                join zdravotny_zaznam using(id_pacienta)
                                 join hospitalizacia using(id_zaznamu)
                                  group by meno, priezvisko, rod_cislo)
                                   where poradie <= (:percent/100)*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                         join zdravotny_zaznam using(id_pacienta)
                                                                                          join hospitalizacia using(id_zaznamu))`, [percent]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getTypyOckovaniaPacienti() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select  meno || ' ' || priezvisko as meno,
                    sum(case when id_typu_ockovania=1 then 1 else 0 end) as "Záškrt",
                    sum(case when id_typu_ockovania=2 then 1 else 0 end) as "Tetanus",
                    sum(case when id_typu_ockovania=3 then 1 else 0 end) as "čierny kašeľ",
                    sum(case when id_typu_ockovania=4 then 1 else 0 end) as "Vírusový zápal pečene typu B (žltačka typu B)",
                    sum(case when id_typu_ockovania=5 then 1 else 0 end) as "Hemofilové invazívne nákazy",
                    sum(case when id_typu_ockovania=6 then 1 else 0 end) as "Detská obrna",
                    sum(case when id_typu_ockovania=7 then 1 else 0 end) as "Pneumokokové invazívne ochorenia",
                    sum(case when id_typu_ockovania=8 then 1 else 0 end) as "Osýpky",
                    sum(case when id_typu_ockovania=9 then 1 else 0 end) as "Ružienka",
                    sum(case when id_typu_ockovania=10 then 1 else 0 end) as "Mumps"
            from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta)
                        left join ockovanie using(id_zaznamu)
            group by meno, priezvisko, rod_cislo`
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getPacientiChorobaP13() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select meno, priezvisko, nazov
                from os_udaje join pacient using(rod_cislo)
                join zoznam_chorob using(id_pacienta)
                join choroba using(id_choroby)
                where to_char(datum_od, 'D') = '5' and to_char(datum_od, 'DD') = '13'
                order by meno, priezvisko`
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getPocetPacientiPodlaVeku() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select count(*), trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as vek
            from pacient join os_udaje using(rod_cislo)
             group by trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
              order by 2`
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getPacienti,
    getNajviacChoriPocet,
    getNajviacOckovaniPercenta,
    getNajviacHospitalizovaniPercenta,
    getTypyOckovaniaPacienti,
    getPacientiChorobaP13,
    getPocetPacientiPodlaVeku
}