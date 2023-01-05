const database = require("../database/Database");

async function getHospitalizacie() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`SELECT rod_cislo, meno, priezvisko, datum, dat_do FROM hospitalizacia join zdravotny_zaznam using(id_zaznamu)
                                                                    join pacient using(id_pacienta)
                                                                    join os_udaje using(rod_cislo)`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getHospitalizacie,
};
