const database = require("../database/Database");

async function getAllOrders(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD, to_char(DATUM_OBJEDNAVKY,'DD.MM.YYYY') AS DATUM_OBJEDNAVKY, to_char(DATUM_DODANIA,'DD.MM.YYYY') AS DATUM_DODANIA
                from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :id
                order by DATUM_DODANIA nulls first`;
        let result = await conn.execute(sqlStatement, {
            id: id
        });
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

        const selDate = new Date(body.sel_date);
        const formattedDate = `${selDate.getDate()}-${selDate.getMonth() + 1}-${selDate.getFullYear()}`;

        const sqlStatement = `begin
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
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

async function insertOrder(body) {
    try {
        let conn = await database.getConnection();
        let sqlStatement = `BEGIN
            insert_order_warehouse(:usr_id, :zoznam_liekov);
        END;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            usr_id: body.usr_id,
            zoznam_liekov: Buffer.from(body.zoznam_liekov, 'utf-8')
        });

        sqlStatement = `select ID_OBJEDNAVKY, OBJEDNAVKA.ID_SKLAD AS ID_SKLAD from OBJEDNAVKA
                    join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :search_id
                    order by ID_OBJEDNAVKY desc fetch first 1 row only`;
        let finalResult = await conn.execute(sqlStatement, {
            search_id: body.usr_id
        });

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