const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
const fs = require("fs");
const path = require('path');

const configFilePath = path.join(__dirname, './config.json');

const dbConfig = JSON.parse(fs.readFileSync(configFilePath, 'UTF-8'));

// async function initialize() {
//     try {
//         await oracledb.createPool(
//             {
//                 user: dbConfig.username,
//                 password: dbConfig.password,
//                 connectString: dbConfig.connectString
//             });
//     } catch (err) {
//         console.log(err);
//     }
// }

//module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool().close();
}

// async function getConnection() {
//     return await oracledb.getConnection();
// }

async function getOracleConnection() {
    try {
        return await oracledb.getConnection(
            {
                user: dbConfig.username,
                password: dbConfig.password,
                connectString: dbConfig.connectString
            });
    } catch (err) {
        console.log(err);
    }
}

module.exports.oracledb = oracledb;
module.exports.getOracleConnection = getOracleConnection;

module.exports.close = close;