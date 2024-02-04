const database = require("../database/Database");

async function getVehicles() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
          `SELECT nazov, ecv, typ_vozidla, 
                  to_char(priradenie, 'dd.mm.yyyy') as dat_priradenia, 
                  to_char(stk, 'dd.mm.yyyy') as dat_stk,
                  case when nvl(datom_do, add_months(sysdate, -1)) < sysdate then 1 end as volne,
                  obrazok
          FROM nemocnica
            JOIN vozidla using (id_nemocnice)
            LEFT JOIN vyjazdy using (ecv)
            LEFT JOIN plan_vyjazdov using (id_plan_vyjazdu)
          ORDER BY id_nemocnice ASC`
        );
    
        return result.rows;
      } catch (err) {
        throw new Error("Database error: " + err);
      }
}

async function getVehiclesECV() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT ecv FROM vozidla Order by ecv ASC`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getVehiclesECVPlanHist(vehicle_ecv) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT nazov, to_char(vyjazdy.datum_od, 'DD:MM:YYYY HH:MI:SS') as datum_cas, odkial, kam
      FROM vyjazdy 
          JOIN plan_vyjazdov USING (id_plan_vyjazdu)
          JOIN typ_ucelu_vyjazdu USING (id_typu_vyjazdu)
      WHERE ecv = :vehicle_ecv AND datom_do IS NOT NULL AND datom_do < sysdate`, {vehicle_ecv}
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getVehiclesECVPlan(vehicle_ecv) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT nazov, to_char(vyjazdy.datum_od, 'DD:MM:YYYY HH:MI:SS') as datum_cas, odkial, kam
      FROM vyjazdy 
          JOIN plan_vyjazdov USING (id_plan_vyjazdu)
          JOIN typ_ucelu_vyjazdu USING (id_typu_vyjazdu)
      WHERE ecv = :vehicle_ecv AND datom_do IS NULL OR datom_do > sysdate`, {vehicle_ecv}
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertVehicle(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vozidlo_insert(:ecv, :id_nemocnice, :typ_vozidla, :stk, :obrazok);
      END;`;

    let result = await conn.execute(sqlStatement, {
      ecv: body.ecv,
      id_nemocnice: body.id_nemocnice,
      typ_vozidla: body.typ_vozidla,
      stk: body.stk,
      obrazok: body.obrazok
    });

  } catch (err) {
    console.log(err);
  }
}

async function updateVehicle(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        vozidlo_update(:ecv, :id_nemocnice, :typ_vozidla, :stk);
      END;`;

    let result = await conn.execute(sqlStatement, {
      ecv: body.ecv,
      id_nemocnice: body.id_nemocnice,
      typ_vozidla: body.typ_vozidla,
      stk: body.stk
    });
  } catch (err) {
    console.log(err);
  }    
}

module.exports = {
  getVehicles,
  getVehiclesECV,
  getVehiclesECVPlanHist,
  getVehiclesECVPlan,
  insertVehicle,
  updateVehicle
}