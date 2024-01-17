const database = require('../database/Database');
const oracledb = database.oracledb;

async function getNemocnice() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM nemocnica`);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

oracledb.fetchAsString = [oracledb.CLOB];

async function getHospitalizacieNemocniceXML(id_nemocnice) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `BEGIN
                :ret := getHospitalizacieNemocnice_f(:id_nemocnice);
             END;`,
      {
        ret: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 1073741824,
        },
        id_nemocnice: id_nemocnice,
      }
    );
    console.log(result.outBinds.ret);
    return result.outBinds.ret;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getOperacieNemocniceXML(id_nemocnice) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `BEGIN
                :ret := getOperacieNemocnice_f(:id_nemocnice);
             END;`,
      {
        ret: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 1073741824,
        },
        id_nemocnice: id_nemocnice,
      }
    );
    console.log(result.outBinds.ret);
    return result.outBinds.ret;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getOckovaniaNemocniceXML(id_nemocnice) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `BEGIN
                :ret := getOckovaniaNemocnice_f(:id_nemocnice);
             END;`,
      {
        ret: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 1073741824,
        },
        id_nemocnice: id_nemocnice,
      }
    );
    console.log(result.outBinds.ret);
    return result.outBinds.ret;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getVysetreniaNemocniceXML(id_nemocnice) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `BEGIN
                :ret := getVysetreniaNemocnice_f(:id_nemocnice);
             END;`,
      {
        ret: {
          dir: oracledb.BIND_OUT,
          type: oracledb.STRING,
          maxSize: 1073741824,
        },
        id_nemocnice: id_nemocnice,
      }
    );
    console.log(result.outBinds.ret);
    return result.outBinds.ret;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getMapaNemocnice(id_nemocnice) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
        SELECT mapa FROM nemocnica WHERE id_nemocnice = :id_nemocnice
      `,
      {
        id_nemocnice: id_nemocnice,
      }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getOddeleniaByNemocnica(hospitalId) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
        id_oddelenia,
        typ_oddelenia 
      FROM 
        oddelenie 
      WHERE 
        id_nemocnice = :hospitalId`,
      { hospitalId: hospitalId }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getAllCurrentlyHospitalizedPatientsForHospital(hospitalId) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
          pl.id_pacient_lozko,
          pl.id_pacienta,
          pl.id_lozka,
          ou.meno,
          ou.priezvisko,
          l.id_miestnost
      FROM 
          pacient_lozko pl
      JOIN 
          lozko l ON pl.id_lozka = l.id_lozka
      JOIN 
          pacient p ON pl.id_pacienta = p.id_pacienta
      JOIN   
          os_udaje ou ON ou.rod_cislo = p.rod_cislo
      WHERE 
          sysdate BETWEEN pl.pobyt_od AND pl.pobyt_do
          AND 
          l.id_nemocnice = :hospitalId
      `,
      { hospitalId: hospitalId }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertMapa(body) {
  try {
    let conn = await database.getConnection();
    console.log(body.mapa.trim());
    const result = await conn.execute(
      `
      UPDATE nemocnica SET 
      mapa = :mapa
      `,
      {
        mapa: body.mapa.replace(/\s/g, ''),
      },
      { autoCommit: true }
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getNemocnice,
  getHospitalizacieNemocniceXML,
  getOperacieNemocniceXML,
  getOckovaniaNemocniceXML,
  getVysetreniaNemocniceXML,
  insertMapa,
  getMapaNemocnice,
  getOddeleniaByNemocnica,
  getAllCurrentlyHospitalizedPatientsForHospital,
};
