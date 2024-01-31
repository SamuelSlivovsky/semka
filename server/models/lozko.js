const database = require("../database/Database");

async function getBedsForRoom(roomId) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
          l.id_lozka,
          CASE
              WHEN pl.id_pacienta IS NULL THEN null
              ELSE ou.meno || ' ' || ou.priezvisko
          END meno,
          pl.pobyt_od,
          pl.pobyt_do
      FROM 
          lozko l
      LEFT JOIN 
          pacient_lozko pl ON pl.id_lozka = l.id_lozka
      JOIN
          miestnost m ON (m.id_miestnosti = l.id_miestnost AND m.id_nemocnice = l.id_nemocnice)
      LEFT JOIN 
          pacient p ON p.id_pacienta = pl.id_pacienta
      LEFT JOIN 
          os_udaje ou ON ou.rod_cislo = p.rod_cislo
      WHERE 
          m.id_miestnosti = :roomId
      ORDER BY 
          l.id_lozka DESC
    `,
      {
        roomId: roomId,
      }
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

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
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getNeobsadeneLozka,
  getBedsForRoom,
};
