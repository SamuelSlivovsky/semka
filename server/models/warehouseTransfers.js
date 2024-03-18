const database = require("../database/Database");

async function getFinishedTransfers(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
            join sklad on PRESUN_LIEKOV.ID_SKLAD_OBJ = sklad.ID_SKLAD
            join NEMOCNICA on sklad.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
            join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
            where CISLO_ZAM = :usr_id and sklad.ID_ODDELENIA is null and STATUS like 'Prijata' order by ID_PRESUN`;
        let result = await conn.execute(sqlStatement, {
            usr_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getWaitingTransfers(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
            join sklad on PRESUN_LIEKOV.ID_SKLAD_OBJ = sklad.ID_SKLAD
            join NEMOCNICA on sklad.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
            join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
            where CISLO_ZAM = :usr_id and sklad.ID_ODDELENIA is null and STATUS like 'Cakajuca' order by ID_PRESUN`;
        let result = await conn.execute(sqlStatement, {
            usr_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getDeclinedTransfers(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
            join sklad on PRESUN_LIEKOV.ID_SKLAD_OBJ = sklad.ID_SKLAD
            join NEMOCNICA on sklad.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
            join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
            where CISLO_ZAM = :usr_id and sklad.ID_ODDELENIA is null and STATUS like 'Zamietnuta' order by ID_PRESUN`;
        let result = await conn.execute(sqlStatement, {
            usr_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getRequestedTransfers(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, (select NAZOV from SKLAD sk1 
                join NEMOCNICA nem1 on sk1.ID_NEMOCNICE = nem1.ID_NEMOCNICE where sk1.ID_SKLAD = PRESUN_LIEKOV.ID_SKLAD_OBJ) as NAZOV,
                ID_ODDELENIA_LIEKU, STATUS from PRESUN_LIEKOV
                join SKLAD on PRESUN_LIEKOV.ID_ODDELENIA_LIEKU = SKLAD.ID_ODDELENIA
                join ODDELENIE on SKLAD.ID_ODDELENIA = ODDELENIE.ID_ODDELENIA
                join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :id and STATUS like 'Cakajuca'
                order by ID_PRESUN`;
        let result = await conn.execute(sqlStatement, {
            usr_id: id
        });
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
           SKLAD.ID_ODDELENIA as ID_ODDELENIA,(SKLAD.CELKOVY_POCET - SKLAD.MINIMALNY_POCET) AS POCET FROM SKLAD
            JOIN LIEK ON SKLAD.ID_LIEK = LIEK.ID_LIEK
            JOIN TRVANLIVOST_LIEKU ON LIEK.ID_LIEK = TRVANLIVOST_LIEKU.ID_LIEK
            WHERE TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI - SYSDATE > 1
              AND SKLAD.CELKOVY_POCET > SKLAD.MINIMALNY_POCET
              AND SKLAD.ID_NEMOCNICE = :search_id
            GROUP BY LIEK.ID_LIEK, LIEK.NAZOV, SKLAD.CELKOVY_POCET, SKLAD.MINIMALNY_POCET, SKLAD.ID_ODDELENIA`;
        let result = await conn.execute(sqlStatement, {
            search_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getSelectedMedications(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select SKLAD.ID_LIEK, LIEK.NAZOV, TO_CHAR(MIN(TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI),'DD.MM.YYYY') AS DATUM_TRVANLIVOSTI, 
                            SKLAD.ID_ODDELENIA, NEMOCNICA.NAZOV as NEMOCNICA, (CELKOVY_POCET - SKLAD.MINIMALNY_POCET) as POCET  from SKLAD
                            join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                            join LIEK on SKLAD.ID_LIEK = LIEK.ID_LIEK
                            left join TRVANLIVOST_LIEKU on SKLAD.ID_SKLAD = TRVANLIVOST_LIEKU.ID_SKLAD
                            where SKLAD.ID_LIEK = :id_l
                                AND (CELKOVY_POCET - SKLAD.MINIMALNY_POCET) = (
                                    select MAX(CELKOVY_POCET - SKLAD.MINIMALNY_POCET) from SKLAD
                                    where ID_LIEK = :id_l)
                            group by SKLAD.ID_LIEK, LIEK.NAZOV, SKLAD.ID_ODDELENIA, NEMOCNICA.NAZOV, (CELKOVY_POCET - SKLAD.MINIMALNY_POCET)`;
        let result = await conn.execute(sqlStatement, {
            id_l: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function createTransfer(body) {
    try {
        let conn = await database.getConnection();
        let sqlStatement = `begin
                    insert_medication_transfer(:zoz_liekov, :id_od, :usr_id);
                end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            zoz_liekov: body.zoznam_liekov,
            id_od: body.id_oddelenia,
            usr_id: body.user_id
        });

        console.log("Rows inserted " + result.rowsAffected);

        sqlStatement = `SELECT ID_PRESUN, ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU
            FROM PRESUN_LIEKOV WHERE ID_PRESUN = (select MAX(ID_PRESUN) from PRESUN_LIEKOV where ID_ODDELENIA_LIEKU = :id_odd)`;
        let finalResult = await conn.execute(sqlStatement, {
            id_odd: body.id_oddelenia
        });
        return finalResult.rows;
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

async function deniedTransfer(body) {
    try {
        let conn = await database.getConnection();
        let sqlStatement = `begin
                            denied_transfer(:id_pres);
                            end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            id_pres: body.id_pres
        });
        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

async function deleteTransfer(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `begin 
                delete_transfer(:id_pres);
            end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            id_pres: body.id_presun
        });

        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    getFinishedTransfers,
    getWaitingTransfers,
    getDeclinedTransfers,
    getListTransfers,
    getWarehouses,
    getHospitalMedication,
    getSelectedMedications,
    getRequestedTransfers,
    createTransfer,
    deniedTransfer,
    deleteTransfer
};