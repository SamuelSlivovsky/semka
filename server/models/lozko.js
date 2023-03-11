const database = require("../database/Database");

async function getNeobsadeneLozka(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select id_lozka from lozko
            join oddelenie using(id_oddelenia)
            where id_lozka not in(select id_lozka from hospitalizacia
            where dat_od = sysdate)
            and cislo_zam = :cislo_zam`,
      [cislo_zam]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getNeobsadeneLozka,
};
