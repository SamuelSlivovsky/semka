const database = require("../database/Database");
const oracledb = database.oracledb;
const { autoCommit } = require("oracledb");
// force all queried BLOBs to be returned as Buffers
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function getZdravotneZaznamy() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM zdravotny_zaznam`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPopisZaznamu(id) {
  console.log(id);
  try {
    let conn = await database.getConnection();
    database.oracledb.fetchAsString = [database.oracledb.CLOB];
    const zaznam = await conn.execute(
      `SELECT popis, nazov FROM zdravotny_zaz where id_zaznamu=:id`,
      { id }
    );
    console.log(zaznam);
    return zaznam.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPriloha(id) {
  try {
    let conn = await database.getConnection();
    console.log(id);
    const result = await conn.execute(
      `SELECT data FROM blob_data WHERE id_zaznamu = :id`,
      { id }
    );
    console.log(result);
    return result.rows[0].DATA;
  } catch (err) {
    console.log(err);
  }
}

async function insertHospitalizacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        hospitalizacia_insert(:rod_cislo, :id_lekara, :datum, :datum_do, :priloha, :nazov, :popis );
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, "base64");
    }

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer !== null ? buffer : body.priloha,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
      datum_do: body.datum_do,
      nazov: body.nazov,
    });
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertOperacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        operacia_insert(:rod_cislo, :id_lekara, :datum, :priloha, :nazov, :popis, :trvanie);
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, "base64");
    }
    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer,
      popis: body.popis,
      datum: body.datum,
      trvanie: body.trvanie,
      id_lekara: body.id_lekara,
      priloha: buffer !== null ? buffer : body.priloha,
      nazov: body.nazov,
    });
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertVysetrenie(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vysetrenie_insert(:rod_cislo, :id_lekara, :datum, :priloha, :nazov, :popis  );
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, "base64");
    }

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
      nazov: body.nazov,
    });
  } catch (err) {
    console.log(err);
  }
}

async function updateZaznam(body) {
  console.log(body);
  try {
    let conn = await database.getConnection();

    await conn.execute(
      `UPDATE ZDRAVOTNY_ZAZ SET DATUM = to_date(to_char(to_timestamp(:datum,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS'))
      WHERE ID_ZAZNAMU = to_number(:id)`,
      { datum: body.datum, id: body.id },
      { autoCommit: true } // type and direction are optional for IN binds
    );
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getZdravotneZaznamy,
  insertOperacia,
  insertHospitalizacia,
  insertVysetrenie,
  getPopisZaznamu,
  getPriloha,
  updateZaznam,
};
