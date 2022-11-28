const database = require("../database/Database");

async function getZoznamChorob() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM zoznam_chorob`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getNajviacChori(pocet) {
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

module.exports = {
    getZoznamChorob,
    getNajviacChori
}