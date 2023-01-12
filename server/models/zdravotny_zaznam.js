const database = require('../database/Database');
const { autoCommit } = require('oracledb');
async function getZdravotneZaznamy() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM zdravotny_zaznam`);

    return result.rows;

  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertHospitalizacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        hospitalizacia_insert(:rod_cislo, :priloha, :popis, :datum, :id_lekara, :datum_do);
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, 'base64');
    }

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer !== null ? buffer : body.priloha,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
      datum_do: body.datum_do,
    });
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertOperacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        operacia_insert(:rod_cislo, :priloha, :popis, :datum, :id_miestnosti, :trvanie, :id_lekara);
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, 'base64');
    }
    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer,
      popis: body.popis,
      datum: body.datum,
      id_miestnosti: body.id_miestnosti,
      trvanie: body.trvanie,
      id_lekara: body.id_lekara,
    });

  } catch {
    throw new Error('Database error: ' + err);
  }
}

async function insertVysetrenie(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vysetrenie_insert(:rod_cislo, :priloha, :popis, :datum, :id_lekara);
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, 'base64');
    }

    await conn.execute(sqlStatement,
      {
        rod_cislo: body.rod_cislo,
        priloha: buffer,
        popis: body.popis,
        datum: body.datum,
        id_lekara: body.id_lekara
      }
    );

  } catch {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getZdravotneZaznamy,
  insertOperacia,
  insertHospitalizacia,
  insertVysetrenie,
  updateZaznam,
};
