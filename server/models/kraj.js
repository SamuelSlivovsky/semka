const database = require("../database/Database");

async function getKraje() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM kraj`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getKrajePodlaPoctuOperovanych() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select kraj.nazov, count(distinct rod_cislo), dense_rank() over(order by count(distinct rod_cislo) desc) as poradie 
                from obec join okres using(id_okresu)
                join kraj using(id_kraja)
                join os_udaje using(PSC)
                join pacient using(rod_cislo)
                join zdravotny_zaznam using(id_pacienta)
                join operacia using(id_zaznamu)
                group by kraj.nazov, id_kraja
                order by poradie`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getKraje,
    getKrajePodlaPoctuOperovanych
}