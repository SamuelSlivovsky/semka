const database = require("../database/Database");

async function getDrugsOfDepartment(cis_zam) {
  try {
    let conn = await database.getConnection();

    const lekaren = await conn.execute(
        `select id_oddelenia, id_lekarne from ZAMESTNANCI where CISLO_ZAM = :id_zam`,
        {id_zam: cis_zam}
    );
    let result = null;
    if(lekaren.rows[0].ID_LEKARNE !== null) {
      //Employee is not from hospital but from pharmacy
      result = await conn.execute(
          `select TRVANLIVOST_LIEKU.id_liek, LEKAREN.id_lekarne, nazov, to_char(DATUM_TRVANLIVOSTI, 'DD.MM.YYYY') as DAT_EXPIRACIE, pocet
          from TRVANLIVOST_LIEKU join LEKARENSKY_SKLAD on TRVANLIVOST_LIEKU.ID_LEKARENSKY_SKLAD = LEKARENSKY_SKLAD.ID_LEKARENSKY_SKLAD
          join LEKAREN on LEKARENSKY_SKLAD.ID_LEKARNE = LEKAREN.ID_LEKARNE
          where LEKAREN.ID_LEKARNE = :id_lek
            and pocet > 0`,
          {id_lek: lekaren.rows[0].ID_LEKARNE}
      );
    } else {
      //Employee is from hospital
      result = await conn.execute(
          `SELECT tl.id_liek, sk.id_oddelenia, l.nazov, to_char(tl.datum_trvanlivosti,'DD.MM.YYYY') DAT_EXPIRACIE , tl.pocet
            FROM trvanlivost_lieku tl join sklad sk on (sk.id_sklad = tl.id_sklad)
                          join liek l on (l.id_liek = tl.id_liek)
            where sk.ID_ODDELENIA = :id_od
            and tl.pocet > 0`,
          {id_od: lekaren.rows[0].ID_ODDELENIA}
      );
    }

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getIdOdd(id) {
  try {
    let conn = await database.getConnection();

    let result = await conn.execute(
        `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`,
        {usr_id: id}
    );

    if(result.rows[0].ID_ODDELENIA === null) {
      //Employee is from pharmacy
      result = await conn.execute(
          `select ID_LEKARNE from ZAMESTNANCI where CISLO_ZAM = :usr_id`,
          {usr_id: id}
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
                          update_liek_sklad(:pocet,:id_liek,:usr_id,:datum);
                          END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_liek: body.id_liek,
      pocet: body.pocet,
      usr_id: body.usr_id,
      datum: body.dat_expiracie,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log(err);
  }
}

async function distributeMedications(body) {
    try {
      let conn = await database.getConnection();

      let sqlStatement = `select unique(ID_ODDELENIA) AS ID_ODDELENIA from ODDELENIE where
            ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :id_zam) 
            and ID_ODDELENIA != (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :id_zam)`;
      console.log(body);
      let result = await conn.execute(sqlStatement, {
        id_zam: body.usr_id
      });

      let avgPocet = Math.floor((body.poc_liekov - body.min_poc) / result.rows.length);

      if(avgPocet > 0) {
        for(let i = 0; i < result.rows.length; i++) {

          let sqlStatement = `begin
                distribute_medication(:id_odd, :dat_l, :poc, :id_l);
                end;`;
          console.log(body);
          let res = await conn.execute(sqlStatement, {
            id_odd: result.rows[i].ID_ODDELENIA,
            dat_l: body.exp_date,
            poc: avgPocet,
            id_l: body.med_id
          });

        }

        sqlStatement = `select SKLAD.ID_SKLAD AS ID_SKLAD from sklad join NEMOCNICA on sklad.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                join TRVANLIVOST_LIEKU on sklad.ID_SKLAD = TRVANLIVOST_LIEKU.ID_SKLAD
                where SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) 
                and TRVANLIVOST_LIEKU.ID_LIEK = :id_l and DATUM_TRVANLIVOSTI = :dat
                fetch first 1 row only`;
        let skl = await conn.execute(sqlStatement, {
          usr_id: body.usr_id,
          id_l: body.med_id,
          dat: body.exp_date
        });

        sqlStatement = `begin
                      update TRVANLIVOST_LIEKU set POCET = :poc where DATUM_TRVANLIVOSTI = :dat and ID_SKLAD = :id_skl;
                      commit;
                  end;`;
        let final = await conn.execute(sqlStatement, {
          poc: body.poc_liekov - (avgPocet * result.rows.length),
          dat: body.exp_date,
          id_skl: skl.rows[0].ID_SKLAD
        });

      }

      console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
      throw new Error("Database error: " + err);
    }
}

async function getExpiredMedications(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `select unique(ID_LIEK) from TRVANLIVOST_LIEKU join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
            join NEMOCNICA on NEMOCNICA.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
            join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
            where DATUM_TRVANLIVOSTI > :exp_date and CISLO_ZAM = :usr_id`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      usr_id: body.usr_id,
      exp_date: body.exp_date
    });

    console.log("Rows inserted " + result.rowsAffected);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function deleteSarza(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        delete_liek(:id_liek, :usr_id, :datum);
                          END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_liek: body.id_liek,
      usr_id: body.usr_id,
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
  distributeMedications,
  getExpiredMedications,
  getIdOdd,
  deleteSarza
};
