const database = require("../database/Database");

async function getTypyZtp() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM postihnutie`);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertTypZtp(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        ztp_insert(:rod_cislo , :id_typu_ztp, :datum_od, :datum_do);
        END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      id_typu_ztp: body.id_typu_ztp,
      datum_od: body.datum_od,
      datum_do: body.datum_do,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function updateZtp(body) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `UPDATE zoznam_postihnuti SET DATUM_DO = to_date(to_char(to_timestamp(:datum_do,'DD/MM/YYYY HH24:MI:SS'),
      'DD/MM/YYYY HH24:MI:SS')) WHERE DATUM_OD = :datum_od AND id_karty = (select id_karty from zdravotna_karta where id_pacienta = :id_pacienta)
      AND id_postihnutia = :id_postihnutia`,
      {
        datum_do: body.datum_do,
        datum_od: body.datum_od,
        id_pacienta: body.id_pacienta,
        id_postihnutia: body.id_postihnutia,
      },
      { autoCommit: true }
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getTypyZtp,
  insertTypZtp,
  updateZtp,
};
