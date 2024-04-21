const database = require("../database/Database");

async function getFinishedTransfers(id) {
    try {
        let conn = await database.getConnection();

        let result = null;

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if(result.rows[0].ID_ODDELENIA === null) {
            //Employee is from central warehouse
            sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, NAZOV, TYP_ODDELENIA, TO_CHAR(DATUM_PRESUNU, 'DD.MM.YYYY') AS DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                join ODDELENIE on ID_ODDELENIA_LIEKU = ODDELENIE.ID_ODDELENIA
                join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                where SKLAD.ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :usr_id) and STATUS like 'Prijata' order by ID_PRESUN`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        } else {
            //Employee is from department warehouse
            sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, NAZOV, TYP_ODDELENIA, TO_CHAR(DATUM_PRESUNU, 'DD.MM.YYYY') AS DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                join ODDELENIE on ID_ODDELENIA_LIEKU = ODDELENIE.ID_ODDELENIA
                join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                where SKLAD.ID_ODDELENIA = (select zam.ID_ODDELENIA from ZAMESTNANCI zam where CISLO_ZAM = :usr_id) and STATUS like 'Prijata' order by ID_PRESUN`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        }

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getWaitingTransfers(id) {
    try {
        let conn = await database.getConnection();
        let result = null;

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if(result.rows[0].ID_ODDELENIA === null) {
            //Employee is from central warehouse
            sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, NAZOV, TYP_ODDELENIA, TO_CHAR(DATUM_PRESUNU, 'DD.MM.YYYY') AS DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join ODDELENIE on ID_ODDELENIA_LIEKU = ODDELENIE.ID_ODDELENIA
                    join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    where SKLAD.ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :usr_id) and STATUS like 'Cakajuca' order by ID_PRESUN`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        } else {
            //Employee is from department warehouse
            sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, NAZOV, TYP_ODDELENIA, TO_CHAR(DATUM_PRESUNU, 'DD.MM.YYYY') AS DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join ODDELENIE on ID_ODDELENIA_LIEKU = ODDELENIE.ID_ODDELENIA
                    join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    where SKLAD.ID_ODDELENIA = (select zam.ID_ODDELENIA from ZAMESTNANCI zam where CISLO_ZAM = :usr_id) and STATUS like 'Cakajuca' order by ID_PRESUN`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        }

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getDeclinedTransfers(id) {
    try {
        let conn = await database.getConnection();

        let result = null;

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if(result.rows[0].ID_ODDELENIA === null) {
            //Employee is from central warehouse
            sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, NAZOV, TYP_ODDELENIA, TO_CHAR(DATUM_PRESUNU, 'DD.MM.YYYY') AS DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join ODDELENIE on ID_ODDELENIA_LIEKU = ODDELENIE.ID_ODDELENIA
                    join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    where SKLAD.ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :usr_id) and STATUS like 'Zamietnuta' order by ID_PRESUN`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        } else {
            //Employee is from department warehouse
            sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, NAZOV, TYP_ODDELENIA, TO_CHAR(DATUM_PRESUNU, 'DD.MM.YYYY') AS DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join ODDELENIE on ID_ODDELENIA_LIEKU = ODDELENIE.ID_ODDELENIA
                    join NEMOCNICA on ODDELENIE.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    where SKLAD.ID_ODDELENIA = (select zam.ID_ODDELENIA from ZAMESTNANCI zam where CISLO_ZAM = :usr_id) and STATUS like 'Zamietnuta' order by ID_PRESUN`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        }

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getRequestedTransfers(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select unique(ID_PRESUN), ID_SKLAD_OBJ,  (select NAZOV from NEMOCNICA join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE where CISLO_ZAM = :usr_id fetch first 1 row only) AS NAZOV,
             (select TYP_ODDELENIA from ZAMESTNANCI join NEMOCNICA on ZAMESTNANCI.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
             join ODDELENIE on NEMOCNICA.ID_NEMOCNICE = ODDELENIE.ID_NEMOCNICE where CISLO_ZAM = :usr_id fetch first 1 row only),
                ID_ODDELENIA_LIEKU, STATUS from PRESUN_LIEKOV
                join sklad on PRESUN_LIEKOV.ID_SKLAD_OBJ = sklad.ID_SKLAD
                where ID_ODDELENIA_LIEKU = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and STATUS like 'Cakajuca'`;
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
        const sqlStatement = `SELECT LIEK.ID_LIEK, LIEK.NAZOV, TO_CHAR(MIN(unique(TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI)),'DD.MM.YYYY') AS DATUM_TRVANLIVOSTI,
           SKLAD.ID_ODDELENIA AS ID_ODDELENIA, TYP_ODDELENIA, POCET FROM SKLAD
            join TRVANLIVOST_LIEKU on SKLAD.ID_SKLAD = TRVANLIVOST_LIEKU.ID_SKLAD
            join LIEK on TRVANLIVOST_LIEKU.ID_LIEK = LIEK.ID_LIEK
            join ODDELENIE on SKLAD.ID_ODDELENIA = ODDELENIE.ID_ODDELENIA
            WHERE TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI - SYSDATE > 1
              AND POCET > 0
              AND SKLAD.ID_NEMOCNICE = :search_id
            GROUP BY LIEK.ID_LIEK, LIEK.NAZOV, SKLAD.CELKOVY_POCET, SKLAD.MINIMALNY_POCET, SKLAD.ID_ODDELENIA, TYP_ODDELENIA, POCET`;
        let result = await conn.execute(sqlStatement, {
            search_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

//@TODO there is issue when searching by exp_date, it will fetch nothing even when there are already expired medications
async function getSelectedMedications(id, exp_date, usr_id) {
    try {
        let conn = await database.getConnection();
        let sqlStatement, result = null;
        if(exp_date === "null") {
            sqlStatement = `select TRVANLIVOST_LIEKU.ID_LIEK, LIEK.NAZOV, TO_CHAR(MIN(TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI),'DD.MM.YYYY') AS DATUM_TRVANLIVOSTI,
                            SKLAD.ID_ODDELENIA, NEMOCNICA.NAZOV as NEMOCNICA, POCET from SKLAD
                            join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                            left join TRVANLIVOST_LIEKU on SKLAD.ID_SKLAD = TRVANLIVOST_LIEKU.ID_SKLAD
                            join LIEK on TRVANLIVOST_LIEKU.ID_LIEK = LIEK.ID_LIEK
                            where TRVANLIVOST_LIEKU.ID_LIEK = :id_l
                            and SKLAD.ID_ODDELENIA != (select ZAMESTNANCI.ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)
                            group by TRVANLIVOST_LIEKU.ID_LIEK, LIEK.NAZOV, SKLAD.ID_ODDELENIA, NEMOCNICA.NAZOV, POCET
                            order by DATUM_TRVANLIVOSTI, POCET fetch first 1 row only`;
            result = await conn.execute(sqlStatement, {
                id_l: id,
                usr_id: usr_id
            });
        } else {
            sqlStatement = `select TRVANLIVOST_LIEKU.ID_LIEK, LIEK.NAZOV, TO_CHAR(MIN(TRVANLIVOST_LIEKU.DATUM_TRVANLIVOSTI),'DD.MM.YYYY') AS DATUM_TRVANLIVOSTI,
                            SKLAD.ID_ODDELENIA, NEMOCNICA.NAZOV as NEMOCNICA, POCET from SKLAD
                        join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                        left join TRVANLIVOST_LIEKU on SKLAD.ID_SKLAD = TRVANLIVOST_LIEKU.ID_SKLAD
                        join LIEK on TRVANLIVOST_LIEKU.ID_LIEK = LIEK.ID_LIEK
                        where TRVANLIVOST_LIEKU.ID_LIEK = :id_l
                        and DATUM_TRVANLIVOSTI > :exp_date
                        and SKLAD.ID_ODDELENIA != (select ZAMESTNANCI.ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)
                        group by TRVANLIVOST_LIEKU.ID_LIEK, LIEK.NAZOV, SKLAD.ID_ODDELENIA, NEMOCNICA.NAZOV, POCET
                        order by DATUM_TRVANLIVOSTI, POCET fetch first 1 row only`;
            result = await conn.execute(sqlStatement, {
                id_l: id,
                exp_date: exp_date,
                usr_id: usr_id
            });
        }

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

async function confirmTransfer(body) {
    try {
        let conn = await database.getConnection();

        let sqlStatement = `begin
                            confirm_transfer(:id_presun, :id_lieku, :pocet);
                        end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            id_presun: body.id_pres,
            id_lieku: body.id_l,
            pocet: body.poc
        });

        sqlStatement = `select ID_SKLAD_OBJ, ZOZNAM_LIEKOV from PRESUN_LIEKOV where ID_PRESUN = :id`;
        console.log(body);
        let transfers = await conn.execute(sqlStatement, {
            id_lieku: body.id_l
        });

        sqlStatement = `begin
                    delete_reocurring_transfers(:id, :zoz);
                end;`;
        console.log(body);
        let final = await conn.execute(sqlStatement, {
            id: transfers.rows[0].ID_SKLAD_OBJ,
            zoz: transfers.rows[0].ZOZNAM_LIEKOV
        });

        console.log("Rows inserted " + result.rowsAffected);
        return "OK";
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function createTransferSelMedAmount(body) {
    try {
        let conn = await database.getConnection();

        const sqlStatement = `SELECT getIdSklad(:usr_id) AS id_skl from dual`;
        console.log(body);
        let idSkl = await conn.execute(sqlStatement, {
            usr_id: body.usr_id
        });

        const medArray = body.medications;
        let insertedTransfers = 0, idSk = idSkl.rows[0].ID_SKL;

        for (const med of medArray) {
            if(med.quantity > 0) {
                const sqlStatement = `select unique(ID_ODDELENIA) AS ID_ODDELENIA from TRVANLIVOST_LIEKU join SKLAD on 
                TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD where POCET > :poc and SKLAD.ID_SKLAD != :id_skl 
                and ID_LIEK = :id_l and ID_ODDELENIA is not null fetch first 5 row only`;
                console.log(body);
                let odd = await conn.execute(sqlStatement, {
                    poc: med.quantity,
                    id_skl: idSk,
                    id_l: med.selectedDrug.ID_LIEK
                });

                const transformedData = ({
                    id: med.selectedDrug.ID_LIEK,
                    name: med.selectedDrug.NAZOV,
                    amount: med.quantity
                });

                const formattedString = JSON.stringify(transformedData);

                for(let index = 0; index < odd.rows.length; index++) {
                    const statement = `begin
                                insert_medication_transfer(:zoz_liekov, :id_od, :usr_id);
                            end;`;
                    let res = await conn.execute(statement, {
                        zoz_liekov: formattedString,
                        id_od: odd.rows[index].ID_ODDELENIA,
                        usr_id: body.usr_id
                    });
                }
                insertedTransfers += odd.rows.length;
            }
        }

        const finalStatement = `select ID_PRESUN, ID_SKLAD_OBJ, ID_ODDELENIA_LIEKU, DATUM_PRESUNU, STATUS from PRESUN_LIEKOV
                            where ID_SKLAD_OBJ = :id_skl order by ID_PRESUN fetch first :inserted row only`;
        console.log(body);
        const insertedTransfersResult = await conn.execute(finalStatement, {
            id_skl: idSk,
            inserted: insertedTransfers
        });

        return insertedTransfersResult.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
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
    createTransferSelMedAmount,
    deniedTransfer,
    confirmTransfer,
    deleteTransfer
};