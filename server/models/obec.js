const database = require('../database/Database');

async function getObce() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT PSC as "name", nazov as "code" FROM obec`
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getObce,
};
