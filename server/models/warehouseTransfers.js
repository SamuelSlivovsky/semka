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

async function getWarehouses() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select unique(nazov) as NAZOV, NEMOCNICA.ID_NEMOCNICE from sklad join NEMOCNICA on sklad.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                where MINIMALNY_POCET < SKLAD.CELKOVY_POCET`,
        );
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getHospitalMedication(id) {
    try {
        let conn = await database.getConnection();
        //@TODO change select
        const sqlStatement = `SELECT LIEK.ID_LIEK, LIEK.NAZOV, TO_CHAR(MIN(TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI),'DD.MM.YYYY') AS DATUM_TRVANLIVOSTI,
           (SKLAD.CELKOVY_POCET - SKLAD.MINIMALNY_POCET) AS POCET FROM SKLAD
            JOIN LIEK ON SKLAD.ID_LIEK = LIEK.ID_LIEK
            JOIN TRVANLIVOST_LIEKU ON LIEK.ID_LIEK = TRVANLIVOST_LIEKU.ID_LIEK
            WHERE TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI - SYSDATE > 1
              AND SKLAD.CELKOVY_POCET > SKLAD.MINIMALNY_POCET
              AND SKLAD.ID_NEMOCNICE = :search_id
            GROUP BY LIEK.ID_LIEK, LIEK.NAZOV, SKLAD.CELKOVY_POCET, SKLAD.MINIMALNY_POCET`;
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
    getListTransfers,
    getWarehouses,
    getHospitalMedication
};