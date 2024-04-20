const database = require("../database/Database");

async function getAllOrders(id) {
    try {
        let conn = await database.getConnection();

        let sqlStatement = `select ID_ODDELENIA, ID_LEKARNE from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        let userCheck = await conn.execute(sqlStatement, {
            usr_id: id
        });

        let result = null;

        if(userCheck.rows[0].ID_LEKARNE !== null) {
            //Employee is from pharmacy
            sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD, to_char(DATUM_OBJEDNAVKY,'DD.MM.YYYY') AS DATUM_OBJEDNAVKY, to_char(DATUM_DODANIA,'DD.MM.YYYY') AS DATUM_DODANIA
                from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                join LEKAREN on SKLAD.ID_LEKARNE = LEKAREN.ID_LEKARNE
                join ZAMESTNANCI on LEKAREN.ID_LEKARNE = ZAMESTNANCI.ID_LEKARNE
                where CISLO_ZAM = :id
                order by DATUM_DODANIA nulls first`;
            result = await conn.execute(sqlStatement, {
                id: id
            });
        } else if(userCheck.rows[0].ID_ODDELENIA === null){
            //Employee is from central warehouse
            sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD, to_char(DATUM_OBJEDNAVKY,'DD.MM.YYYY') AS DATUM_OBJEDNAVKY, to_char(DATUM_DODANIA,'DD.MM.YYYY') AS DATUM_DODANIA
                from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :id
                and SKLAD.ID_ODDELENIA is null
                order by DATUM_DODANIA nulls first`;
            result = await conn.execute(sqlStatement, {
                id: id
            });
        } else {
            //Employee is from department warehouse
            sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD, to_char(DATUM_OBJEDNAVKY,'DD.MM.YYYY') AS DATUM_OBJEDNAVKY, to_char(DATUM_DODANIA,'DD.MM.YYYY') AS DATUM_DODANIA
                from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                where SKLAD.ID_NEMOCNICE = (select ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :id) and
                      ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :id)`;
            result = await conn.execute(sqlStatement, {
                id: id
            });
        }

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getListOrders(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `SELECT TO_CHAR(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV, DATUM_DODANIA
                FROM OBJEDNAVKA
                WHERE ID_OBJEDNAVKY = :search_id`;
        let result = await conn.execute(sqlStatement, {
            search_id: id
        });
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function confirmOrder(body) {
    try {
        let conn = await database.getConnection();
        let sqlStatement = null;
        const selDate = new Date(body.sel_date);
        const formattedDate = `${selDate.getDate()}-${selDate.getMonth() + 1}-${selDate.getFullYear()}`;

        sqlStatement = `select TO_CHAR(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV from OBJEDNAVKA where ID_OBJEDNAVKY = :id_obj`;
        console.log(body);
        let jsonArray = await conn.execute(sqlStatement, {
            id_obj: body.id_obj
        });

        let jsonData = JSON.parse(jsonArray.rows[0].ZOZNAM_LIEKOV);

        const arrayJson = Array.isArray(jsonData) ? jsonData : [jsonData];
        const index = arrayJson.findIndex(item => item.id === body.id);

        if(index !== -1 && arrayJson[index].amount !== body.poc) {
            arrayJson[index].amount = body.poc;
            const jsonArray = JSON.stringify(arrayJson);

            sqlStatement = `begin
                        update_order_json(:order_id, :zoz);
                    end;`;
            console.log(body);
            let array = await conn.execute(sqlStatement, {
                order_id: body.id_obj,
                zoz: jsonArray
            });
        }

        sqlStatement = `begin
                        confirm_order(:id_l, :poc, :id_obj, :sel_date);
                    end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            id_l: body.id,
            poc: body.poc,
            id_obj: body.id_obj,
            sel_date: formattedDate
        });

        console.log("Rows inserted " + result.rowsAffected);
        return "OK";
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

async function insertOrder(body) {
    try {
        let result, finalResult = null;
        let conn = await database.getConnection();
        let sqlStatement = `BEGIN
            insert_order_warehouse(:usr_id, :zoz_liek);
        END;`;
        console.log(body);
        result = await conn.execute(sqlStatement, {
            usr_id: body.usr_id,
            zoz_liek: body.zoznam_liekov
        });

        sqlStatement = `select ID_LEKARNE from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        let userCheck = await conn.execute(sqlStatement, {
            usr_id: body.usr_id,
        });

        if(userCheck.rows[0].ID_LEKARNE === null) {
            sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD from OBJEDNAVKA
                    join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :search_id
                    order by ID_OBJEDNAVKY desc fetch first 1 row only`;
            finalResult = await conn.execute(sqlStatement, {
                search_id: body.usr_id,
            });
        } else {
            sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD from OBJEDNAVKA
                    join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join LEKAREN on SKLAD.ID_LEKARNE = LEKAREN.ID_LEKARNE
                    join ZAMESTNANCI on LEKAREN.ID_LEKARNE = ZAMESTNANCI.ID_LEKARNE
                    where CISLO_ZAM = :search_id
                    order by ID_OBJEDNAVKY desc fetch first 1 row only`;
            finalResult = await conn.execute(sqlStatement, {
                search_id: body.usr_id,
            });
        }

        console.log("Rows inserted " + result.rowsAffected);
        return finalResult.rows;
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

async function deleteObjednavka(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `begin
                delete_order_warehouse(:id_obj);
            end;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            id_obj: body.id_obj
        });

        console.log("Rows inserted " + result.rowsAffected);
        return "OK";
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    getAllOrders,
    getListOrders,
    insertOrder,
    confirmOrder,
    deleteObjednavka
};