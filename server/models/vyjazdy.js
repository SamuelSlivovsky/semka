const database = require("../database/Database");

async function getDepartureTypes() {
  try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `SELECT * FROM typ_ucelu_vyjazdu`
      );
  
      return result.rows;
    } catch (err) {
      throw new Error("Database error: " + err);
    }
}

async function getDeparturePlans() {
  try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `SELECT id_plan_vyjazdu, to_char(pv.datum_od, 'DD.MM.YYYY HH24:MI') as planovany_datum, tuv.nazov, m.nazov  as odkial_mesto, me.nazov as kam_mesto, trvanie 
        FROM plan_vyjazdov pv
            JOIN mesto m ON (pv.odkial_mesto  = m.psc)
            JOIN mesto me ON (pv.kam_mesto  = me.psc)
            JOIN typ_ucelu_vyjazdu tuv ON (pv.id_typu_vyjazdu = tuv.id_typu_vyjazdu)
        WHERE id_plan_vyjazdu NOT IN (
            SELECT id_plan_vyjazdu FROM vyjazdy
          )
        ORDER BY id_plan_vyjazdu ASC`
      );
  
      return result.rows;
    } catch (err) {
      throw new Error("Database error: " + err);
    }
}

async function getDepartures() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT to_char(vyjazdy.datum_od, 'DD.MM.YYYY HH24:MI') as planovany_vyjazd, nazov, ecv 
      FROM vozidla
        JOIN vyjazdy USING (ecv)
        JOIN plan_vyjazdov USING (id_plan_vyjazdu)
        JOIN typ_ucelu_vyjazdu USING (id_typu_vyjazdu)
      WHERE vyjazdy.datum_od >= sysdate
      ORDER BY vyjazdy.datum_od ASC`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function getDeparturesHistory() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT to_char(vyjazdy.datum_od, 'DD.MM.YYYY HH24:MI') as datum_vyjazdu, nazov, ecv 
      FROM vozidla
        JOIN vyjazdy USING (ecv)
        JOIN plan_vyjazdov USING (id_plan_vyjazdu)
        JOIN typ_ucelu_vyjazdu USING (id_typu_vyjazdu)
      WHERE vyjazdy.datum_od < sysdate
      ORDER BY vyjazdy.datum_od DESC`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }  
}

async function insertDeparturePlan(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        plan_vyjazdov_insert(:start, :departure_type, :where_from, :where_to, :address_from, :address_to, :id_hospital_from, :id_hospital_to, :lasting);
      END;`;

    let result = await conn.execute(sqlStatement, {
      start: body.start,
      departure_type: body.departure_type,
      where_from: body.where_from,
      where_to: body.where_to,
      address_from: body.address_from,
      address_to: body.address_to,
      id_hospital_from: body.hospital_from,
      id_hospital_to: body.hospital_to,
      lasting: body.lasting
    });

  } catch (err) {
    console.log(err);
  }
}


module.exports = {
  getDepartureTypes,
  getDeparturePlans,
  getDepartures,
  getDeparturesHistory,
  insertDeparturePlan,
}