const database = require("../database/Database");

async function getPacientiZtp() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM pacient_ztp`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function insertPacientZtp(body) {
    try {
        let conn = await database.getConnection();
        const sqlStatement = `BEGIN
        pacient_ZTP_insert(:id_pacienta, :id_typu_ztp, :dat_od, :dat_do);
      END;`;

        let result = await conn.execute(sqlStatement,
            {
                id_pacienta: body.id_pacienta,
                id_typu_ztp: body.id_typu_ztp,
                dat_od: body.dat_od,
                dat_do: body.dat_do
            }
        );

        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        console.log(err);
    }
}


module.exports = {
    getPacientiZtp,
    insertPacientZtp
}