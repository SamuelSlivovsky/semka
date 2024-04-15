const oracledb = require("oracledb");
const path = require("path");
const instantClientPath = path.join(__dirname, "instantclient_21_7");
try {
  oracledb.initOracleClient({ libDir: instantClientPath });
} catch (err) {
  console.error("Whoops!");
  console.error(err);
  process.exit(1);
}
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const fs = require("fs");

const configFilePath = path.join(__dirname, "../config/dbConfig.json");

const dbConfig = JSON.parse(fs.readFileSync(configFilePath, "UTF-8"));

async function getConnection() {
  try {
    return await oracledb.getConnection({
      user: dbConfig.username,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
    });
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  oracledb,
  getConnection,
};
