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

module.exports = {
  getTypyZtp,
  insertTypZtp,
};
