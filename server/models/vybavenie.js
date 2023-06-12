const database = require("../database/Database");

async function getAllEquipment(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT id_vybavenia, typ, to_char(zaobstaranie,'DD.MM.YYYY') ZAOBSTARANIE, 
      case when to_char(id_oddelenia) is null then ecv else to_char(id_oddelenia) end as MIESTO
      FROM vybavenie where id_oddelenia =:id`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function deleteEquip(body) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `delete from vybavenie where id_vybavenia = :id`,
      { id: body.id_vybavenia },
      {
        autoCommit: true,
      }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertVybavenie(body) {
  try {
    let conn = await database.getConnection();
    console.log(body);
    const sqlStatement = `BEGIN 
    vybavenie_insert(:id_oddelenia, :ecv, :typ, :zaobstaranie);
    END;`;


    let result = await conn.execute(sqlStatement, {
     id_oddelenia: body.id_oddelenia,
     ecv: null,
     typ : body.typ,
     zaobstaranie: body.dat_zaobstarania,
    });
    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getAllEquipment,
  deleteEquip,
  insertVybavenie
};
