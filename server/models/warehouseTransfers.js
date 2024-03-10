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
            `select * from PRESUN_LIEKOV where STATUS like 'Neprijata' order by ID_PRESUN`,
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

async function getNewTransferParams(id) {
    try {
        let conn = await database.getConnection();

        const id_sklad = await conn.execute(
            `select ID_SKLAD from sklad where ID_NEMOCNICE = :id and ID_ODDELENIA is null`,
            { id }
        );

        const sqlStatement = `select ID_PRESUN, ID_SKLAD_OBJ, ID_SKLAD_PRIJ from PRESUN_LIEKOV where ID_SKLAD_PRIJ = :id_pres`;
        let result = await conn.execute(sqlStatement, {
            id_pres: id_sklad.rows[0].ID_SKLAD
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }

}

async function createHospTransfer(body) {
    try {
        let conn = await database.getConnection();
        let sqlStatement = `begin
                    insert_hospital_transfer(:zoz_liek, :id_nem_pos, :usr_id);
                end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            zoz_liek: body.zoznam_liekov,
            id_nem_pos: body.id_nemocnice,
            usr_id: body.user_id
        });

        const id_zam = body.user_id;
        console.log("Rows inserted " + result.rowsAffected);
        const id_sklad = await conn.execute(
            `select ID_SKLAD from ZAMESTNANCI join NEMOCNICA on ZAMESTNANCI.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join SKLAD on NEMOCNICA.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
    where CISLO_ZAM = :id and SKLAD.ID_ODDELENIA is null`,
            { id: id_zam }
        );

        sqlStatement = `SELECT ID_PRESUN, ID_SKLAD_OBJ, ID_SKLAD_PRIJ
                            FROM PRESUN_LIEKOV
                            WHERE ID_PRESUN = (
                                SELECT MAX(ID_PRESUN)
                                FROM PRESUN_LIEKOV
                                WHERE ID_SKLAD_OBJ = :id_pres
                            )`;
        let finalResult = await conn.execute(sqlStatement, {
            id_pres: id_sklad.rows[0].ID_SKLAD
        });
        return finalResult.rows;
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

module.exports = {
    getFinishedTransfers,
    getWaitingTransfers,
    getListTransfers,
    getWarehouses,
    getHospitalMedication,
    createHospTransfer,
};