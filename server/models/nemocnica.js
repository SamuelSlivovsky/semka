const database = require("../database/Database");

async function getNemocnice() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM nemocnica`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getSumaVyplatRoka(id_nemocnice) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select sum(case when to_char(datum, 'MM') = '01' then suma else 0 end) as Januar,
            sum(case when to_char(datum, 'MM') = '02' then suma else 0 end) as Februar,
            sum(case when to_char(datum, 'MM') = '03' then suma else 0 end) as Marec,
            sum(case when to_char(datum, 'MM') = '04' then suma else 0 end) as April,
            sum(case when to_char(datum, 'MM') = '05' then suma else 0 end) as Maj,
            sum(case when to_char(datum, 'MM') = '06' then suma else 0 end) as Jun,
            sum(case when to_char(datum, 'MM') = '07' then suma else 0 end) as Jul,
            sum(case when to_char(datum, 'MM') = '08' then suma else 0 end) as August,
            sum(case when to_char(datum, 'MM') = '09' then suma else 0 end) as September,
            sum(case when to_char(datum, 'MM') = '10' then suma else 0 end) as Oktober,
            sum(case when to_char(datum, 'MM') = '11' then suma else 0 end) as November,
            sum(case when to_char(datum, 'MM') = '12' then suma else 0 end) as December
             from nemocnica join oddelenie using(id_nemocnice)
                             join zamestnanec using(id_oddelenia)
                              join vyplata@db_link_vyplaty using(id_zamestnanca)
                                 where id_nemocnice = :id_nemocnice`, [id_nemocnice]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getNemocnice,
    getSumaVyplatRoka
}