const database = require('../database/Database');

async function getRecepty() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM recept`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertRecept(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
            recept_insert(:id_lieku, :rod_cislo, :id_lekara, :datum, :datum_vyzdvihnutia);
        END;`;
    console.log(body);
    let result = await conn.execute(sqlStatement, {
      id_lieku: body.id_lieku,
      rod_cislo: body.rod_cislo,
      id_lekara: body.id_lekara,
      datum: body.datum,
      datum_vyzdvihnutia: body.datum_vyzdvihnutia,
    });

    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getRecepty,
  insertRecept,
};
