const database = require("../database/Database");


//TODO Pridat export logov do ErrorLogy na admin panely
async function getLogs() {
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
    getLogs,
};