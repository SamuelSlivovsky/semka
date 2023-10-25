const database = require("../database/Database");
const oracledb = database.oracledb;

async function getLieky() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT nazov, id_liek as "ID_LIEK" FROM liek`
    );
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getNajviacPredpisovaneLiekyRoka(rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select poradie "Poradie", nazov_lieku "Liek", pocet_predpisani "Počet predpísaní" from
            (select l.nazov as nazov_lieku, count(*) as pocet_predpisani, rank() over(order by count(*) desc) as poradie 
                    from liek l join recept r on(l.id_lieku = r.id_lieku)
                        where to_char(datum, 'YYYY') = :rok
                            group by l.nazov, l.id_lieku
                    ) where poradie <= 0.10*(select count(*) from liek join recept using(id_lieku)  where to_char(datum, 'YYYY') = :rok)`,
      {
        rok: { val: rok, dir: oracledb.BIND_IN, type: oracledb.STRING },
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getLieky,
  getNajviacPredpisovaneLiekyRoka,
};
