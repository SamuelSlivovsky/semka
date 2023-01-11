const database = require('../database/Database');

async function getObce() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT PSC || ' - ' || nazov as "name", PSC as "psc" FROM obec`
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getObce,
};
