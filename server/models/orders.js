const database = require("../database/Database");

async function getAllOrders() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select ID_OBJEDNAVKY, ID_SKLAD, to_char(DATUM_OBJEDNAVKY,'DD.MM.YYYY') DATUM_OBJEDNAVKY, to_char(DATUM_DODANIA,'DD.MM.YYYY') DATUM_DODANIA
                from OBJEDNAVKA order by ID_OBJEDNAVKY`,
        );
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getListOrders(id) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `SELECT TO_CHAR(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV
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

async function insertOrder(body) {
    //@TODO zmenit
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
            insert_order_warehouse(:id_sklad, :zoznam_liekov);
        END;`;
        console.log(body);
        let result = await conn.execute(sqlStatement, {
            id_sklad: body.id_sklad,
            zoznam_liekov: Buffer.from(body.zoznam_liekov, 'utf-8')
        });

        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        console.log("Error Model");
        console.log(err);
    }
}

module.exports = {
    getAllOrders,
    getListOrders,
    insertOrder
};