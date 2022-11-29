const database = require("../database/Database");

async function getChoroby() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM choroba`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getNajcastejsieChorobyRokaPocet(pocet, rok) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select nazov from
                (select nazov,rank() over (order by count(id_choroby) desc) as rank
                    from zoznam_chorob join choroba using(id_choroby)
                        where to_char(datum_od,'YYYY')=':rok'
                        or to_char(datum_do,'YYYY')=':rok'
                        group by nazov, id_choroby
                )
            where rank<=:pocet`, [pocet, rok]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getChoroby,
    getNajcastejsieChorobyRokaPocet
}