const database = require("../database/Database");

async function getDrugsOfDepartment(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT sz.id_sarze, l.nazov, to_char(sz.dat_expiracie,'DD.MM.YYYY') DAT_EXPIRACIE , sz.pocet_liekov 
                    FROM sarza sz join sklad sk on (sk.id_skladu = sz.id_skladu and sk.id_oddelenia = :id)
                                  join liek l on (l.id_lieku = sz.id_lieku)`,
      { id }
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertDrug(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
            insert_sarza(:id_sarze, :id_oddelenia, :nazov_lieku, :dat_expiracie, :pocet_liekov);
        END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_sarze: body.id_sarze,
      id_oddelenia: body.id_oddelenia,
      nazov_lieku: body.nazov_lieku,
      dat_expiracie: body.dat_expiracie,
      pocet_liekov: body.pocet_liekov,
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
                          update_sarza(:pocet_liekov,:id_sarze);
                          END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_sarze: body.id_sarze,
      pocet_liekov: body.pocet_liekov,
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
                          delete_sarza(:id_sarze);
                          END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_sarze: body.id_sarze,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getDrugsOfDepartment,
  insertDrug,
  updateQuantity,
  deleteSarza,
};
