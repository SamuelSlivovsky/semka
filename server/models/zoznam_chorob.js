const database = require("../database/Database");

async function getZoznamChorob() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM zoznam_chorob`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getZoznamChorob,
    getNajviacChori
}