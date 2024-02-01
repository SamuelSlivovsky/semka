const { element } = require("xml");
const database = require("../database/Database");

async function getZoznamManazerovLekarni() {
    try {
      let conn = await database.getConnection();
  
      const result = await conn.execute(
        `SELECT meno || ', ' ||priezvisko as "meno", mesto.nazov as mesto_mazov, lekaren.nazov as lekaren_nazov, cislo_zam
        from  zamestnanci
                      join os_udaje using(rod_cislo)
                      join mesto using(PSC)
                      left join lekaren using(PSC)`
      );
  
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {
    getZoznamManazerovLekarni,
  };