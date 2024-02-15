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

  async function getManazerLekarneInfo(id) {
    try {
      let conn = await database.getConnection();
      const info = await conn.execute(
        `select os_udaje.rod_cislo, meno, priezvisko,trunc(months_between(sysdate, to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) 
        || '.' || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek, to_char(to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) || '.' 
        || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia,
        PSC, mesto.nazov as nazov_obce from zamestnanci
                    join os_udaje on(os_udaje.rod_cislo = zamestnanci.rod_cislo) 
                    join mesto using(PSC) 
                      where zamestnanci.cislo_zam = :id`,
        [id]
      );
  
      return info.rows;
    } catch (err) {
      console.log(err);
    }
  }

  module.exports = {
    getManazeriLekarni,
    getLekarnici,
    getManazerLekarneInfo,
  };