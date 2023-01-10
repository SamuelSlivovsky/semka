const database = require('../database/Database');
const { autoCommit } = require('oracledb');
async function getZdravotneZaznamy() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM zdravotny_zaznam`);

    return result.rows;
  } catch (err) {
    console.log(err);
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
    console.log(err);
    throw new Error('Error');
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
  } catch (err) {
    console.log(err);
    throw new Error('Error');
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

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
    });
  } catch {
    throw new Error('Error');
  }
}

async function updateZaznam(body) {
  console.log(body);
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `UPDATE ZDRAVOTNY_ZAZNAM SET DATUM = to_date(to_char(to_timestamp(:datum,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS'))
      WHERE ID_ZAZNAMU = to_number(:id)`,
      { datum: body.datum, id: body.id },
      { autoCommit: true } // type and direction are optional for IN binds
    );
    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    console.error(err); // logging error
    throw new Error('Error');
  }
}

module.exports = {
  getZdravotneZaznamy,
  insertOperacia,
  insertHospitalizacia,
  insertVysetrenie,
  updateZaznam,
};
