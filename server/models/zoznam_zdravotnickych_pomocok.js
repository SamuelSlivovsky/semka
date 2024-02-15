const { element } = require("xml");
const database = require("../database/Database");

async function getZoznamZdravotnickychPomocok() {
    try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `select * from zdravotna_pomocka`,
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {
    getZoznamZdravotnickychPomocok,
  };