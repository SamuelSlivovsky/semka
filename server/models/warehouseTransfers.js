const database = require("../database/Database");

async function getFinishedTransfers() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select * from PRESUN_LIEKOV where STATUS like 'Prijata'`,
        );
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getWaitingTransfers() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select * from PRESUN_LIEKOV where STATUS like 'Neprijata'`,
        );
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getListTransfers(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select to_char(ZOZNAM_LIEKOV) as ZOZNAM_LIEKOV from 
                        PRESUN_LIEKOV where ID_PRESUN = :search_id`;
        let result = await conn.execute(sqlStatement, {
            search_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    getFinishedTransfers,
    getWaitingTransfers,
    getListTransfers
};