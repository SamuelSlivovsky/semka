const database = require("../database/Database");
const oracledb = database.oracledb;

async function getNemocnice() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM nemocnica`);

    return result.rows;
  } catch (err) {
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
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
    console.log(err);
  }
}

module.exports = {
  getNemocnice,
  getSumaVyplatRoka,
  getHospitalizacieNemocniceXML,
  getOperacieNemocniceXML,
  getOckovaniaNemocniceXML,
  getVysetreniaNemocniceXML,
};
