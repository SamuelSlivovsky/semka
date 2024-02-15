const { element } = require("xml");
const database = require("../database/Database");

async function getZoznamLiekov() {
    try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `select * from liek`,
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {
    getZoznamLiekov,
  };