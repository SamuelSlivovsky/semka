const { element } = require("xml");
const database = require("../database/Database");

async function getManazeriLekarni() {
    try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `select cislo_zam, rod_cislo, meno, priezvisko, id_typ, zamestnanci.id_lekarne, lekaren.nazov as "LEKAREN_NAZOV", mesto.nazov as "MESTO_NAZOV"
        from zamestnanci 
        join os_udaje using (rod_cislo)
        join lekaren on (zamestnanci.id_lekarne = lekaren.id_lekarne)
        join mesto on (mesto.PSC = lekaren.PSC)
        where id_typ = 10`,
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  async function getLekarnici() {
    try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `select cislo_zam, rod_cislo, meno, priezvisko, id_typ, zamestnanci.id_lekarne, lekaren.nazov as "LEKAREN_NAZOV", mesto.nazov as "MESTO_NAZOV"
        from zamestnanci 
        join os_udaje using (rod_cislo)
        join lekaren on (zamestnanci.id_lekarne = lekaren.id_lekarne)
        join mesto on (mesto.PSC = lekaren.PSC)
        where id_typ = 9`,
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {
    getManazeriLekarni,
    getLekarnici,
  };