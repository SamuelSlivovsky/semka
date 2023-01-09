const database = require('../database/Database');

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
        hospitalizacia_insert(:rod_cislo, :priloha, :popis, :datum, :id_lekara, :dat_do);
        END;`;

    let buffer = Buffer.from(body.priloha, 'base64');

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer,
      popis: body.popis,
      datum: body.datum,
      id_lekara: body.id_lekara,
      dat_do: body.dat_do,
    });
  } catch {
    throw new Error('Error');
  }
}

async function insertOperacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        operacia_insert(:rod_cislo, :priloha, :popis, :datum, :id_miestnosti, :trvanie);
        END;`;

    let buffer = Buffer.from(body.priloha, 'base64');

    await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: buffer,
      popis: body.popis,
      datum: body.datum,
      id_miestnosti: body.id_miestnosti,
      trvanie: body.trvanie,
    });
  } catch {
    throw new Error('Error');
  }
}

async function insertVysetrenie(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vysetrenie_insert(:rod_cislo, :id_prilohy, :popis, :datum, :id_lekara);
        END;`;

    let buffer = Buffer.from(body.priloha, 'base64');

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
    const sqlStatement = `
    UPDATE ZDRAVOTNY_ZAZNAM SET DATUM = to_date(to_char(to_timestamp(:datum,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS'))
      WHERE ID_ZAZNAMU = to_number(:id)`;

    await conn.execute(sqlStatement, {
      datum: body.datum,
      id: body.id,
    });
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
