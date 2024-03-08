const database = require("../database/Database");

async function getDrugsOfDepartment(cis_zam) {
  try {
    let conn = await database.getConnection();
    const id_oddelenia = await conn.execute(
      `SELECT id_oddelenia from zamestnanci where cislo_zam = :cis_zam`,
      { cis_zam }
    );
    const id_odd = id_oddelenia.rows[0].ID_ODDELENIA;

    const result = await conn.execute(
      `SELECT tl.id_liek, l.nazov, to_char(tl.datum_trvanlivosti,'DD.MM.YYYY') DAT_EXPIRACIE , tl.pocet 
      FROM trvanlivost_lieku tl join sklad sk on (sk.id_sklad = tl.id_sklad)
                    join liek l on (l.id_liek = tl.id_liek)`,
    );
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertDrug(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
            insert_liek_sklad(:id_oddelenia, :nazov_lieku, :dat_expiracie, :pocet_liekov);
        END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_oddelenia: body.id_oddelenia,
      nazov_lieku: body.nazov_lieku,
      dat_expiracie: body.dat_expiracie,
      pocet_liekov: body.pocet,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Error Model");
    console.log(err);
  }
}

async function updateQuantity(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
                          update_liek_sklad(:pocet,:id_liek,:datum);
                          END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_liek: body.id_liek,
      pocet: body.pocet,
      datum: body.dat_expiracie,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log(err);
  }
}

async function deleteSarza(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        delete_liek(:id_liek, :datum);
                          END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_liek: body.id_liek,
      datum: body.datum,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getDrugsOfDepartment,
  insertDrug,
  updateQuantity,
  deleteSarza,
};
