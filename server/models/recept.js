const database = require("../database/Database");

async function getRecepty() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM recept`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertRecept(body) {
  try {
    let conn = await database.getConnection();
    console.log(body);
    const sqlStatement = `BEGIN
            recept_insert(:id_lieku, :rod_cislo, :cislo_zam, :datum_zapisu, :datum_vyzdvihnutia, :poznamka, :opakujuci);
        END;`;

    let result = await conn.execute(sqlStatement, {
      id_lieku: body.id_lieku,
      rod_cislo: body.rod_cislo,
      cislo_zam: body.cislo_zam,
      datum_zapisu: body.datum_zapisu,
      datum_vyzdvihnutia: body.datum_vyzdvihnutia,
      poznamka: body.poznamka,
      opakujuci: body.opakujuci,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log(err);
    if (err.errorNum && err.errorNum === 20000) {
      console.error("Tento liek už je vydaný ale neprevzatý");
      throw new Error("Tento liek už je vydaný ale neprevzatý");
    } else if (err.errorNum && err.errorNum === 20001) {
      console.error("Pacient s týmto rodným číslom neexistuje");
      throw new Error("Pacient s týmto rodným číslom neexistuje");
    } else {
      throw new Error(err.message || err);
    }
  }
}

module.exports = {
  getRecepty,
  insertRecept,
};
