const database = require("../database/Database");

async function getKraje() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM kraj`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getKraje,
};
