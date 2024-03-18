const database = require("../database/Database");

async function getDrugsOfDepartment(cis_zam) {
  try {
    let conn = await database.getConnection();

    const lekaren = await conn.execute(
        `select id_lekarne from ZAMESTNANCI where CISLO_ZAM = :id_zam`,
        {id_zam: cis_zam}
    );
    let result = null;
    if(lekaren.rows[0].id_lekarne !== undefined) {
      //Employee is not from hospital but from pharmacy
      result = await conn.execute(
          `select TRVANLIVOST_LIEKU.id_liek, LEKAREN.id_lekarne, nazov, to_char(DATUM_TRVANLIVOSTI, 'DD.MM.YYYY') as DAT_EXPIRACIE, pocet
          from TRVANLIVOST_LIEKU join LEKARENSKY_SKLAD on TRVANLIVOST_LIEKU.ID_LEKARENSKY_SKLAD = LEKARENSKY_SKLAD.ID_LEKARENSKY_SKLAD
          join lekaren on LEKARENSKY_SKLAD.ID_LEKARNE = lekaren.ID_LEKARNE
          join ZAMESTNANCI on lekaren.ID_LEKARNE = ZAMESTNANCI.ID_LEKARNE
          where CISLO_ZAM = :id_zam`,
          {id_zam: cis_zam}
      );
    } else {
      //Employee is from hospital
      result = await conn.execute(
          `SELECT tl.id_liek, sk.id_oddelenia, l.nazov, to_char(tl.datum_trvanlivosti,'DD.MM.YYYY') DAT_EXPIRACIE , tl.pocet
      FROM trvanlivost_lieku tl join sklad sk on (sk.id_sklad = tl.id_sklad)
                    join liek l on (l.id_liek = tl.id_liek)
      join NEMOCNICA on sk.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
      join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
      where CISLO_ZAM = :id_zam`,
          {id_zam: cis_zam}
      );
    }



    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertDrug(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
            insert_liek_sklad(:usr_id, :nazov_lieku, :dat_expiracie, :pocet_liekov);
        END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      usr_id: body.usr_id,
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
