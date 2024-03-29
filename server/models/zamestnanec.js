const database = require("../database/Database");
const fs = require("fs");
const oracledb = database.oracledb;
// force all queried BLOBs to be returned as Buffers
oracledb.fetchAsBuffer = [oracledb.BLOB];

async function getZamestnanci() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM zamestnanec`);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getZamestnanciFotka(id_zamestnanca) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT fotka FROM fotka join zamestnanec using(id_fotky) WHERE id_zamestnanca = :id_zamestnanca`,
      [id_zamestnanca]
    );
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getZamestnanec(id_zamestnanca) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT
      meno
      || ' '
      || priezvisko                AS meno,
      rod_cislo,
      id_zamestnanca,
      trunc(months_between(sysdate, to_date('19'
                                            || substr(rod_cislo, 0, 2)
                                            || '.'
                                            || mod(substr(rod_cislo, 3, 2), 50)
                                            || '.'
                                            || substr(rod_cislo, 5, 2),
                                            'YYYY.MM.DD')) / 12)       AS vek,
      psc || ' ' ||
      nazov as adresa
  FROM
           zamestnanec
      JOIN os_udaje USING ( rod_cislo )
      JOIN obec USING ( psc )
  WHERE
      id_zamestnanca = :id_zamestnanca`,
      [id_zamestnanca]
    );
    console.log(result.rows[0]);
    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getZamestnanci,
  getZamestnanciFotka,
  getZamestnanec,
};
