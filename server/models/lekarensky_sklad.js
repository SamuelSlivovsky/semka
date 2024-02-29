const database = require("../database/Database");

async function getMedicaments(cis_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT id_oddelenia from zamestnanci where cislo_zam = :cis_zam`,
      { cis_zam }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertMedicament(body) {
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

async function updateQuantityOfMedicaments(body) {
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

async function deleteMedicament(body) {
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
  getMedicaments,
  insertMedicament,
  updateQuantityOfMedicaments,
  deleteMedicament,
};
