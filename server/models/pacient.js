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



module.exports = {
    getPacienti,
    getNajviacChoriPocet,
    getNajviacOckovaniPercenta,
    getNajviacHospitalizovaniPercenta
}