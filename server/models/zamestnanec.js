const database = require("../database/Database");
const fs = require("fs");
const oracledb = database.oracledb;
// force all queried BLOBs to be returned as Buffers
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function getZamestnanci() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM zamestnanec`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZamestnanciFotka(id_zamestnanca) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT fotka FROM fotka join zamestnanec using(id_fotky) WHERE id_zamestnanca = :id_zamestnanca`,
      [id_zamestnanca]
    );
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getZamestnanci,
  getZamestnanciFotka,
};
