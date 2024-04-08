const database = require("../database/Database");

async function getMedAmount(id) {
    try {
        let conn = await database.getConnection();

        let result = null;
        let finalResult = [];

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if(result.rows[0].ID_ODDELENIA === null) {
            //Getting amount of medications in warehouse
            sqlStatement = `select SUM(POCET) AS POCET from TRVANLIVOST_LIEKU join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null and DATUM_DODANIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of finished orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null and DATUM_DODANIA is not null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of confirmed orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Prijata'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of declined orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Zamietnuta'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of requested orders for department
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_ODDELENIA_LIEKU = SKLAD.ID_ODDELENIA
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

        } else {
            sqlStatement = `select SUM(POCET) AS POCET from TRVANLIVOST_LIEKU join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and DATUM_DODANIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of finished orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and DATUM_DODANIA is not null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of confirmed orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Prijata'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of declined orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Zamietnuta'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of requested orders for department
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_ODDELENIA_LIEKU = SKLAD.ID_ODDELENIA
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);
        }

        return finalResult;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getMedications(id){
    try {
        let conn = await database.getConnection();

        let result = null;

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if (result.rows[0].ID_ODDELENIA === null) {
            sqlStatement = `select unique(LIEK.NAZOV) AS NAZOV, TRVANLIVOST_LIEKU.ID_LIEK AS ID_LIEK from LIEK
                join TRVANLIVOST_LIEKU on LIEK.ID_LIEK = TRVANLIVOST_LIEKU.ID_LIEK
                join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null and POCET > 0`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        } else {
            sqlStatement = `select unique(LIEK.NAZOV) AS NAZOV, TRVANLIVOST_LIEKU.ID_LIEK AS ID_LIEK from LIEK
                join TRVANLIVOST_LIEKU on LIEK.ID_LIEK = TRVANLIVOST_LIEKU.ID_LIEK
                join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and POCET > 0`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        }

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getMedStats(id) {
    try {
        let conn = await database.getConnection();

        let result = null;

        //@TODO add selects in here for stats of medication

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    getMedAmount,
    getMedications,
    getMedStats
};