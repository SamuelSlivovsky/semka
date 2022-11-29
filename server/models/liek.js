const database = require("../database/Database");

async function getLieky() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM liek`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getNajviacPredpisovaneLiekyRoka(rok) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select nazov_lieku, pocet_predpisani, poradie from
            (select l.nazov as nazov_lieku, count(*) as pocet_predpisani, rank() over(order by count(*) desc) as poradie 
                    from liek l join recept r on(l.id_lieku = r.id_lieku)
                        where to_char(datum, 'YYYY') = '2020'
                            group by l.nazov, l.id_lieku
                    ) where poradie <= 0.10*(select count(*) from liek join recept using(id_lieku)  where to_char(datum, 'YYYY') = ':rok')`, [rok]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getLieky,
    getNajviacPredpisovaneLiekyRoka
}