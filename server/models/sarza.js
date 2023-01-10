const database = require("../database/Database");

async function getSarze() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM sarza`,
        );

        return result.rows;

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

async function insertSarza(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        sarza_insert(:id_skladu, :id_lieku, :dat_expiracie, :pocet_expiracie);
      END;`;

        let result = await conn.execute(sqlStatement,
            {
                id_skladu: body.id_skladu,
                id_lieku: body.id_lieku,
                dat_expiracie: body.dat_expiracie,
                pocet_expiracie: body.pocet_expiracie
            }
        );

        console.log("Rows inserted " + result.rowsAffected);

    } catch (err) {
        throw new Error('Database error: ' + err);
    }
}

module.exports = {
    getSarze,
    insertSarza
}