const database = require("../database/Database");

async function getTypyOddelenia() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM typ_oddelenia`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getTypyOddelenia,
};
