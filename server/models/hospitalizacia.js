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

async function insertHospitalizacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
      hospitalizacia_insert(:id_lekara, :id_zaznamu, :id_lozka, :id_sestricky, :dat_do);
      END;`;

    let result = await conn.execute(sqlStatement, {
      id_lekara: body.id_lekara,
      id_zaznamu: body.id_zaznamu,
      id_lozka: body.id_lozka,
      id_sestricky: body.id_sestricky,
      dat_do: body.dat_do,
    });

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertHospitalizacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
      hospitalizacia_insert(:id_lekara, :id_zaznamu, :id_lozka, :id_sestricky, :dat_do);
      END;`;

    let result = await conn.execute(sqlStatement, {
      id_lekara: body.id_lekara,
      id_zaznamu: body.id_zaznamu,
      id_lozka: body.id_lozka,
      id_sestricky: body.id_sestricky,
      dat_do: body.dat_do,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getHospitalizacie,
  insertHospitalizacia,
};
