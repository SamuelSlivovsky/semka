const database = require("../database/Database");


async function getAllLogs() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select id_logu, to_char(datum,'DD.MM.YYYY HH:MM:SS') datum, tabulka, typ, popis, ip, riadok from log_table order by id_logu`,
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


async function insertLogFailedLogin(body) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `BEGIN
            insert_log(:table,:status,:description,:ip);
            END;`,
            {
                status: body.status,
                description: "User with ip " + body.ip + " has tried to log into " + body.userid + " with password: " + body.pwd,
                ip: body.ip,
                table: "USER_TAB"
            },
            {autoCommit: true}
        );
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    insertLogFailedLogin,
    getAllLogs,
    getNumberOfWrongLogins,
};