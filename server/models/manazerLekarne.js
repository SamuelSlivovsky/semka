const { element } = require("xml");
const database = require("../database/Database");

async function getManazeriLekarni() {
    try {
      let conn = await database.getConnection();
      const result = await conn.execute(
        `select zamestnanci.rod_cislo as "ROD_CISLO", meno, priezvisko, cislo_zam, id_typ, zamestnanci.id_lekarne, lekaren.nazov as "LEKAREN_NAZOV", mesto.nazov as "MESTO" from zamestnanci 
        join os_udaje on (os_udaje.rod_cislo = zamestnanci.rod_cislo)
        join mesto on (mesto.PSC = os_udaje.PSC)
        join lekaren on (lekaren.PSC = mesto.PSC)
        where zamestnanci.id_lekarne is not null and id_typ = 10`,
      );
      return result.rows;
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {
    getManazeriLekarni,
  };

  // SELECT rod_cislo, meno, priezvisko, mesto.nazov as "mesto", lekaren.nazov as "lekaren_nazov", cislo_zam
  //       from  zamestnanci
  //                     join os_udaje using(rod_cislo)
  //                     join mesto using(PSC)
  //                     join lekaren using(PSC)