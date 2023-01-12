const database = require("../database/Database");
const oracledb = database.oracledb;

async function getChoroby(pid_typu_choroby) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT * FROM choroba
          where id_typu_choroby = :pid_typu_choroby`,
      { pid_typu_choroby }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
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
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getChoroby,
  getNajcastejsieChorobyRokaPocet,
};
