const database = require("../database/Database");
const oracledb = database.oracledb;

async function getOckovania() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM ockovanie`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertOckovanie(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        ockovanie_insert(:rod_cislo , :priloha, :popis , :datum,  :id_typu_ockovania, :id_nemocnice);
        END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: body.priloha,
      popis: body.popis,
      datum: body.datum,
      id_typu_ockovania: body.id_typu_ockovania,
      id_nemocnice: body.id_nemocnice,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getOckovania,
  insertOckovanie,
};
