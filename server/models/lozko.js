const database = require("../database/Database");
const moment = require('moment');

async function getBedsForRoom(roomId, roomFrom) {
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
          CASE
              WHEN pl.id_pacienta IS NULL THEN null
              WHEN MOD(SUBSTR(ou.rod_cislo, 3, 2), 50) = 0 THEN 'F'
              ELSE 'M'
          END pohlavie,
          pl.pobyt_od,
          pl.pobyt_do
      FROM 
          lozko l
      LEFT JOIN 
          pacient_lozko pl ON pl.id_lozka = l.id_lozka AND pl.pobyt_do >= TO_DATE(:roomFrom, 'DD.MM.YYYY HH24:MI')
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
        roomFrom: roomFrom
          ? moment(roomFrom, 'DD.MM.YYYY HH:mm').format('DD.MM.YYYY HH:mm')
          : moment().format('DD.MM.YYYY HH:mm'),
      }
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPatientBirthNumberFromBed(bedId) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
          p.rod_cislo
      FROM
          lozko l
      JOIN pacient_lozko pl ON pl.id_lozka = l.id_lozka
      JOIN pacient p ON p.id_pacienta = pl.id_pacienta
      WHERE 
          l.id_lozka = :bedId
    `,
      {
        bedId: bedId,
      }
    );

    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
}

async function getNeobsadeneLozka(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select * from lozko 
      where id_miestnost=:id`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getNeobsadeneLozka,
  getBedsForRoom,
  getPatientBirthNumberFromBed,
};
