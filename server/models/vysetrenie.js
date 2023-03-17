const database = require("../database/Database");

async function getVysetrenia() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM vysetrenie`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertVysetrenie(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vysetrenie_insert(:rod_cislo , :priloha, :popis , :datum,  :id_lekara);
        END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: body.priloha,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getVysetrenia,
  insertVysetrenie,
};
