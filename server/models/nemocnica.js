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

async function getNemocnicaNazvy() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT id_nemocnice, nazov FROM nemocnica ORDER BY nazov ASC`);
    
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
  getNemocnicaNazvy,
};
