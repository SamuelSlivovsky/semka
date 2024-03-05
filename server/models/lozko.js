const database = require("../database/Database");

async function getNeobsadeneLozka(id) {
  console.log(id);
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select * from lozko 
      where id_miestnost=:id`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getNeobsadeneLozka,
};
