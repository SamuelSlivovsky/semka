const database = require("../database/Database");

async function getNeobsadeneLozka(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(id_lozka) as "pocet" from lozko
      join oddelenie using(id_oddelenia)
      join nemocnica using (id_nemocnice)
      join zamestnanci using (id_nemocnice)
      where id_lozka not in(select id_lozka from hospitalizacia
      where dat_od = sysdate or (dat_od <= sysdate and dat_do <= sysdate))
      and zamestnanci.cislo_zam = :cislo_zam`,
      [cislo_zam]
    );

    return result.rows[0];
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getNeobsadeneLozka,
};
