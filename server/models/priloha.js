const database = require("../database/Database");
const { autoCommit } = require("oracledb");
async function insertPriloha(blob) {
  try {
    let conn = await database.getConnection();
    let buffer = Buffer.from(blob, "base64");
    console.log(buffer);
    const result = await conn.execute(
      `INSERT INTO priloha(priloha) VALUES (:blob)`,
      { blob: buffer },
      { autoCommit: true } // type and direction are optional for IN binds
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  insertPriloha,
};
