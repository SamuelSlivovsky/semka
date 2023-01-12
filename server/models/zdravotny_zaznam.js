const database = require("../database/Database");
const oracledb = database.oracledb;
// force all queried BLOBs to be returned as Buffers
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function getZdravotneZaznamy() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM zdravotny_zaznam`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPopisZaznamu(id) {
  try {
    let conn = await database.getConnection();
    database.oracledb.fetchAsString = [database.oracledb.CLOB];
    const zaznam = await conn.execute(
      `SELECT popis FROM zdravotny_zaznam where id_zaznamu=:id`,
      { id }
    );
    return zaznam.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPriloha(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT priloha FROM priloha join zdravotny_zaznam using(id_prilohy) WHERE id_zaznamu = :id`,
      { id }
    );
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
}

async function insertHospitalizacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        hospitalizacia_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_lekara, :dat_do);
        END;`;

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      id_prilohy: body.id_prilohy,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
      dat_do: body.dat_do,
    });
  } catch {
    throw new Error("Error");
  }
}

async function insertOperacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        operacia_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_miestnosti, :trvanie);
        END;`;

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      id_prilohy: body.id_prilohy,
      popis: body.popis,
      datum: body.datum,
      id_miestnosti: body.id_miestnosti,
      trvanie: body.trvanie,
    });
  } catch {
    throw new Error("Error");
  }
}

async function insertVysetrenie(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vysetrenie_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_lekara);
        END;`;

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      id_prilohy: body.id_prilohy,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
    });
  } catch {
    throw new Error("Error");
  }
}

module.exports = {
  getZdravotneZaznamy,
  insertOperacia,
  insertHospitalizacia,
  insertVysetrenie,
  getPopisZaznamu,
  getPriloha,
};
