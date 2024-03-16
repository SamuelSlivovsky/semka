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

async function getNeobsadeneLozka(id) {
  console.log(id);
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select * from lozko 
      where id_miestnost=:id`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getNeobsadeneLozka,
  getBedsForRoom,
};
