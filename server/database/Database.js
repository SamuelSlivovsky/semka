const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const fs = require("fs");
const path = require("path");

const configFilePath = path.join(__dirname, "./config.json");

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
