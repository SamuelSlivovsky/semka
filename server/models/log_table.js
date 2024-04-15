const database = require("../database/Database");


async function getAllLogs() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select id_logu, to_char(datum,'YYYY-MM-DD HH24:MI:SS') datum, tabulka, typ, popis, ip, riadok from log_table order by id_logu`,
        );
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getNumberOfWrongLogins(ip) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select count(typ) as pocet from log_table where typ = 'failed login' and ip = :ip and datum > sysdate - 1/24`,
            {ip}
        );
        if (result.rows[0].POCET >= 5){
            return true;
        }

    } catch (err) {
        throw new Error("Database error: " + err);
    }
}


async function insertLog(body) {
    if (body.ip === undefined) {
        body.ip = null;
    }
    if (body.riadok === undefined) {
        body.riadok = null;
    }
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `BEGIN
            insert_log(:table,:status,:description,:ip,:riadok);
            END;`,
            {
                status: body.status,
                description: body.description,
                ip: body.ip,
                table: body.table,
                riadok: body.riadok,
            },
            {autoCommit: true}
        );
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    insertLog,
    getAllLogs,
    getNumberOfWrongLogins,
};