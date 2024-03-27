const database = require("../database/Database");

async function getDrugsOfDepartment(cis_zam) {
  try {
    let conn = await database.getConnection();

    const lekaren = await conn.execute(
        `select ID_ODDELENIA, ID_LEKARNE from ZAMESTNANCI where CISLO_ZAM = :id_zam`,
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
            and pocet > 0 order by DATUM_TRVANLIVOSTI`,
          {id_lek: lekaren.rows[0].ID_LEKARNE}
      );
    } else if (lekaren.rows[0].ID_ODDELENIA === null) {
      //Employee is from hospital
      result = await conn.execute(
          `SELECT tl.id_liek, l.nazov, to_char(tl.datum_trvanlivosti,'DD.MM.YYYY') DAT_EXPIRACIE , tl.pocet
            FROM trvanlivost_lieku tl join sklad sk on (sk.id_sklad = tl.id_sklad)
                          join liek l on (l.id_liek = tl.id_liek)
            where sk.ID_ODDELENIA is null
            and ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :usr_id)
            and tl.pocet > 0 order by tl.datum_trvanlivosti`,
          {usr_id: cis_zam}
      );
    } else {
      result = await conn.execute(
          `SELECT tl.id_liek, sk.id_oddelenia, l.nazov, to_char(tl.datum_trvanlivosti,'DD.MM.YYYY') DAT_EXPIRACIE , tl.pocet
            FROM trvanlivost_lieku tl join sklad sk on (sk.id_sklad = tl.id_sklad)
                          join liek l on (l.id_liek = tl.id_liek)
            where sk.ID_ODDELENIA = :id_od
            and tl.pocet > 0 order by tl.datum_trvanlivosti`,
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
        `select ID_ODDELENIA, ID_LEKARNE, (select NAZOV from NEMOCNICA join ZAMESTNANCI on 
         NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE where CISLO_ZAM = :usr_id) AS NAZOV_NEM,
         (select NAZOV from LEKAREN join ZAMESTNANCI on LEKAREN.ID_LEKARNE = ZAMESTNANCI.ID_LEKARNE 
         where CISLO_ZAM = :usr_id) AS NAZOV_LEK from ZAMESTNANCI where CISLO_ZAM = :usr_id`,
        {usr_id: id}
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

      let sqlStatement = `select unique(ID_ODDELENIA), KAPACITA from ODDELENIE
                    where ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :id_zam)`;
      console.log(body);
      let result = await conn.execute(sqlStatement, {
        id_zam: body.usr_id
      });

      //Now calculate whole capacity of selected departments
      let capacity = 0, avgPocet = 0, distAmount = 0, medAmount = body.poc_liekov, check = false;

      for(const row of result.rows) {
        capacity += row.KAPACITA;
      }

      //For each insert calculate amount of medications
      for(const row of result.rows) {

        if(check) {
          break;
        }
        avgPocet = Math.floor((row.KAPACITA / capacity) * body.poc_liekov);

        if(medAmount - avgPocet < body.min_poc || avgPocet === 0) {
          //Amount for send is less than calculated amount, set check = true and on next iteration FOR will end
          avgPocet = medAmount - body.min_poc;
          check = true;
        }
        distAmount += avgPocet;
        medAmount -= avgPocet;

        let sqlStatement = `begin
                distribute_medication(:id_odd, :dat_l, :poc, :id_l);
                end;`;
        console.log(body);
        let res = await conn.execute(sqlStatement, {
          id_odd: row.ID_ODDELENIA,
          dat_l: body.exp_date,
          poc: avgPocet,
          id_l: body.med_id
        });

      }

      sqlStatement = `select SKLAD.ID_SKLAD AS ID_SKLAD from sklad join NEMOCNICA on sklad.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                join TRVANLIVOST_LIEKU on sklad.ID_SKLAD = TRVANLIVOST_LIEKU.ID_SKLAD
                where SKLAD.ID_ODDELENIA is null
                and TRVANLIVOST_LIEKU.ID_LIEK = :id_l and DATUM_TRVANLIVOSTI = :dat
                fetch first 1 row only`;
      let skl = await conn.execute(sqlStatement, {
        id_l: body.med_id,
        dat: body.exp_date
      });

      sqlStatement = `begin
                      update TRVANLIVOST_LIEKU set POCET = :poc where DATUM_TRVANLIVOSTI = :dat and ID_SKLAD = :id_skl;
                      commit;
                  end;`;
      let final = await conn.execute(sqlStatement, {
        poc: body.poc_liekov - distAmount,
        dat: body.exp_date,
        id_skl: skl.rows[0].ID_SKLAD
      });

      console.log("Rows inserted " + result.rowsAffected);
      return "OK";
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
            where DATUM_TRVANLIVOSTI < :exp_date and CISLO_ZAM = :usr_id`;
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

async function getMedicationsByAmount(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `select unique(ID_LIEK) from TRVANLIVOST_LIEKU join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
            join NEMOCNICA on NEMOCNICA.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
            join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
            where POCET < :amount and CISLO_ZAM = :usr_id`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      usr_id: body.usr_id,
      amount: body.amount
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
  getMedicationsByAmount,
  getIdOdd,
  deleteSarza
};
