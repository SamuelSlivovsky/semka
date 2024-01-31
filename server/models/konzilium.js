const database = require("../database/Database");

async function getKonzilia(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT * from konzilium
            JOIN zam_konzilium using (id_konzilia)
            where cislo_zam =:cislo_zam `,
      { cislo_zam }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getKonzilia,
};
