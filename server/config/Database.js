const oracledb = require("oracledb");

async function initialize() {
    try {
        await oracledb.createPool(
            {

                user: "labat_sp",
                password: "heslo1234",               // mypw contains the hr schema password
                connectString: "obelix.fri.uniza.sk:1521/orcl.fri.uniza.sk"

            });
    } catch (err) {

    }
}

module.exports.initialize = initialize;

async function close() {
    await oracledb.getPool('hrPool').close();
}

async function getConn() {
    return await oracledb.getConnection();
}

module.exports.getConn = getConn;

module.exports.close = close;