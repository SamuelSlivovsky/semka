const database = require("../database/Database");

async function getLozka() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM lozko`,
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

async function getNeobsadeneLozkaOddeleniaTyzden(id_oddelenia) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select id_lozka from lozko 
                join miestnost using(id_miestnosti)
                where id_lozka not in
                (select id_lozka from hospitalizacia
                                    join zdravotny_zaznam using(id_zaznamu)
                                        where sysdate < dat_do
                                        and sysdate + 7 < dat_do)
                and id_oddelenia = :id_oddelenia
                order by id_lozka`, [id_oddelenia]
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getLozka,
    getNeobsadeneLozkaOddeleniaTyzden
}