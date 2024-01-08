const database = require("../database/Database");

async function getSpravy(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT meno, priezvisko, cs.id_spravy, cs.userid, cs.id_skupiny, cs.sprava, to_char(cs.datum, 'DD.MM.YYYY HH24:MI:SS') as datum, cs.datum as unformated_date FROM chat_sprava cs
        join user_chat uc on (cs.userid = uc.userid AND cs.id_skupiny = uc.id_skupiny)
        join user_tab ut on (uc.userid = ut.userid)
        join zamestnanci z on (z.cislo_zam = uc.userid)
        join os_udaje using (rod_cislo)
          where cs.id_skupiny = :id
          order by cs.datum asc`,
      { id }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertSprava(body) {
  try {
    let conn = await database.getConnection();
    console.log(body.datum);
    const sqlStatement = `BEGIN
        sprava_insert(:userid , :id_skupiny, :sprava, :datum);
        END;`;

    let result = await conn.execute(sqlStatement, {
      userid: body.userid,
      id_skupiny: body.id_skupiny,
      sprava: body.sprava,
      datum: body.datum,
    });
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertUser(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `insert into user_chat values(:userid, :id_skupiny)`;

    let result = await conn.execute(sqlStatement, {
      userid: body.userid,
      id_skupiny: body.id_skupiny,
    });

    await conn.execute("commit");
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getSpravy,
  insertSprava,
  insertUser,
};
