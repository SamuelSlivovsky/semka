const database = require("../database/Database");
const oracledb = database.oracledb;

async function getChoroby(typ) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT * FROM choroba
          where typ = :typ`,
      { typ }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function updateChoroba(body) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `UPDATE zoznam_ochoreni SET DAT_DO = to_date(to_char(to_timestamp(:datum_do,'DD/MM/YYYY HH24:MI:SS'),
      'DD/MM/YYYY HH24:MI:SS')) WHERE DAT_OD = :datum_od AND id_karty = (select id_karty from zdravotna_karta where id_pacienta = :id_pacienta)`,
      {
        datum_do: body.datum_do,
        datum_od: body.datum_od,
        id_pacienta: body.id_pacienta,
      },
      { autoCommit: true }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertChoroba(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        choroba_insert(:rod_cislo , :typ, :nazov, :datum_od, :datum_do);
        END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      typ: body.typ,
      nazov: body.nazov,
      datum_od: body.datum_od,
      datum_do: body.datum_do,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getNajcastejsieChorobyRokaPocet(pocet, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select poradie "Poradie",pocet_chorob "Počet chorôb" , nazov "Názov choroby" from
                (select nazov, rank() over (order by count(id_choroby) desc) as poradie,
                count(id_choroby) as pocet_chorob
                    from zoznam_chorob join choroba using(id_choroby)
                        where to_char(datum_od,'YYYY')= :rok
                        or to_char(datum_od,'YYYY')= :rok
                        group by nazov, id_choroby
                )
            where poradie <= :pocet
                order by poradie`,
      {
        rok: { val: rok, dir: oracledb.BIND_IN, type: oracledb.STRING },
        pocet: pocet,
      }
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getChoroby,
  insertChoroba,
  getNajcastejsieChorobyRokaPocet,
  updateChoroba,
};
