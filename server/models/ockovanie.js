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
        ockovanie_insert(:rod_cislo , :id_vakciny,:datum);
        END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      datum: body.datum,
      id_vakciny: body.id_vakciny,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    if (err.errorNum && err.errorNum === 20001) {
      console.error("Pacient s týmto rodným číslom neexistuje");
      throw new Error("Pacient s týmto rodným číslom neexistuje");
    } else if (err.errorNum && err.errorNum === 20000) {
      console.error("Pacient už má toto očkovanie");
      throw new Error("Pacient už má toto očkovanie");
    } else {
      throw new Error(err.message || err);
    }
  }
}

module.exports = {
  getOckovania,
  insertOckovanie,
};
