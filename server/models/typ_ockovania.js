const database = require("../database/Database");

async function getTypyOckovania() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT distinct typ, nazov FROM vakcina`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getTypyOckovania,
};
