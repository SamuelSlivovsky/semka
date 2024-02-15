const database = require("../database/Database");

async function getSpravy(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
      meno, 
      priezvisko, 
      cs.id_spravy, 
      cs.userid, 
      cs.id_skupiny, 
      cs.sprava, 
      TO_CHAR(cs.datum, 'DD.MM.YYYY HH24:MI:SS') AS datum,
      cs.datum AS unformatted_date, 
      us.id_spravy AS "unreadId", 
      us.userid AS "unreadUserId" 
  FROM 
      (SELECT * FROM chat_sprava WHERE id_skupiny = :id ORDER BY datum DESC FETCH FIRST 50 ROWS ONLY) cs
  JOIN 
      user_chat uc ON cs.userid = uc.userid AND cs.id_skupiny = uc.id_skupiny
  LEFT JOIN 
      user_sprava us ON us.id_spravy = cs.id_spravy
  JOIN 
      user_tab ut ON uc.userid = ut.userid
  JOIN 
      zamestnanci z ON z.cislo_zam = uc.userid
  JOIN 
      os_udaje USING (rod_cislo)
  ORDER BY 
      cs.datum ASC
  `,
      { id }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getNextSpravy(id, id_spravy) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
      meno, 
      priezvisko, 
      cs.id_spravy, 
      cs.userid, 
      cs.id_skupiny, 
      cs.sprava, 
      TO_CHAR(cs.datum, 'DD.MM.YYYY HH24:MI:SS') AS datum,
      cs.datum AS unformatted_date, 
      us.id_spravy AS "unreadId", 
      us.userid AS "unreadUserId" 
  FROM 
      (SELECT * FROM chat_sprava WHERE id_skupiny = :id AND id_spravy < :id_spravy ORDER BY datum DESC FETCH FIRST 50 ROWS ONLY) cs
  JOIN 
      user_chat uc ON cs.userid = uc.userid AND cs.id_skupiny = uc.id_skupiny
  LEFT JOIN 
      user_sprava us ON us.id_spravy = cs.id_spravy
  JOIN 
      user_tab ut ON uc.userid = ut.userid
  JOIN 
      zamestnanci z ON z.cislo_zam = uc.userid
  JOIN 
      os_udaje USING (rod_cislo)
  ORDER BY 
      cs.datum ASC
  `,
      { id, id_spravy }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getUnread(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT count(userid) as pocet from user_sprava where userid =:id and precital = 'N'`,
      { id }
    );

    return result.rows[0];
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertSprava(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
        sprava_insert(:userid , :id_skupiny, :sprava, :datum);
        END;`;

    let result = await conn.execute(
      sqlStatement,
      {
        userid: body.userid,
        id_skupiny: body.id_skupiny,
        sprava: body.sprava,
        datum: body.datum,
      },
      { autoCommit: true }
    );
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

async function updateReadStatus(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `delete from user_sprava where userid = :userid AND id_spravy in 
    (select id_spravy from chat_sprava join user_chat using (id_skupiny) where id_skupiny =:id_skupiny)`;

    await conn.execute(
      sqlStatement,
      {
        userid: body.userid,
        id_skupiny: body.id_skupiny,
      },
      { autoCommit: true }
    );
    console.log("deleted");
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getGroups(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT chat_skupina.nazov, chat_skupina.id_skupiny as id_skupiny, count(us.id_spravy) as pocet from chat_skupina join user_chat u on(u.id_skupiny = chat_skupina.id_skupiny) 
      left join chat_sprava cs on (cs.id_skupiny = u.id_skupiny)
      left join user_sprava us on (cs.id_spravy = us.id_spravy and u.userid = us.userid)
      where u.userid =:id
      group by chat_skupina.id_skupiny, nazov`,
      { id }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getSpravy,
  insertSprava,
  insertUser,
  updateReadStatus,
  getUnread,
  getNextSpravy,
  getGroups,
};
