const database = require("../database/Database");
const oracledb = database.oracledb;
oracledb.fetchAsBuffer = [oracledb.BLOB];
async function getSpravy(id_skupiny, userid) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT
      DISTINCT cs.id_spravy,
      meno,
      priezvisko,
      cs.id_skupiny,
      cs.userid,
      cs.sprava,
      CASE WHEN cs.obrazok IS NOT NULL AND DBMS_LOB.GETLENGTH(cs.obrazok) > 1 THEN 1 ELSE 0 END AS has_obrazok,
      TO_CHAR(cs.datum, 'DD.MM.YYYY HH24:MI:SS') AS datum,
      cs.datum AS unformatted_date,
      us.id_spravy AS "unreadId",
      us.userid AS "unreadUserId"
  FROM
      (SELECT * FROM chat_sprava WHERE id_skupiny = :id_skupiny ORDER BY datum DESC FETCH FIRST 50 ROWS ONLY) cs
  JOIN
      user_chat uc ON (cs.id_skupiny = uc.id_skupiny and uc.USERID = :userid)
  LEFT JOIN
      user_sprava us ON (us.id_spravy = cs.id_spravy AND us.userid = :userid)
  JOIN
      user_tab ut ON cs.userid = ut.userid
  JOIN
      zamestnanci z ON z.cislo_zam = cs.userid
  JOIN
      os_udaje USING (rod_cislo)
  WHERE
  (uc.HISTORIA = 1 OR uc.ADMIN = 1 OR cs.datum > uc.DATUM_PRIDANIA)
  ORDER BY
      cs.datum ASC
  `,
      { id_skupiny, userid, userid }
    );

    const messages = result.rows.map((row) => {
      return {
        SPRAVA: row.SPRAVA,
        DATUM: row.DATUM,
        USERID: Number(row.USERID),
        MENO: row.MENO,
        PRIEZVISKO: row.PRIEZVISKO,
        UNFORMATTED_DATE: row.UNFORMATTED_DATE,
        unreadId: row.unreadId,
        unreadUserId: row.unreadUserId,
        ID_SPRAVY: row.ID_SPRAVY,
        HAS_OBRAZOK: row.HAS_OBRAZOK,
      };
    });

    return messages;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getObrazok(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT 
     obrazok from chat_sprava where id_spravy =:id`,
      { id }
    );

    return result.rows[0].OBRAZOK;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getNextSpravy(body) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `   SELECT 
      meno, 
      priezvisko, 
      cs.id_spravy, 
      cs.userid, 
      cs.id_skupiny, 
      cs.sprava, 
        CASE WHEN cs.obrazok IS NOT NULL AND DBMS_LOB.GETLENGTH(cs.obrazok) > 1 THEN 1 ELSE 0 END AS has_obrazok,
      TO_CHAR(cs.datum, 'DD.MM.YYYY HH24:MI:SS') AS datum,
      cs.datum AS unformatted_date, 
      us.id_spravy AS "unreadId", 
      us.userid AS "unreadUserId" 
  FROM 
      (SELECT * FROM chat_sprava WHERE id_skupiny = :id_skupiny AND id_spravy < :id_spravy ORDER BY datum DESC FETCH FIRST 50 ROWS ONLY) cs
 JOIN
    user_chat uc ON (cs.id_skupiny = uc.id_skupiny and uc.USERID = :userid)
LEFT JOIN
    user_sprava us ON (us.id_spravy = cs.id_spravy AND us.userid = :userid)
  JOIN 
      user_tab ut ON uc.userid = ut.userid
  JOIN 
      zamestnanci z ON z.cislo_zam = cs.userid
  JOIN 
      os_udaje USING (rod_cislo)
      WHERE
(uc.HISTORIA = 1 OR uc.ADMIN = 1 OR cs.datum > uc.DATUM_PRIDANIA)
  ORDER BY 
      cs.datum ASC
  `,
      {
        id_skupiny: body.id_skupiny,
        id_spravy: body.id_spravy,
        userid: body.userid,
        userid: body.userid,
      }
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

async function isAdmin(id, id_skupiny) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT admin from user_chat where userid =:id AND id_skupiny =:id_skupiny`,
      { id, id_skupiny }
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
        sprava_insert(:userid , :id_skupiny, :sprava, :datum, :priloha);
        END;`;

    let buffer = Buffer.from([0x00]);
    if (body.priloha !== null) {
      buffer = Buffer.from(body.priloha, "base64");
    }

    let result = await conn.execute(
      sqlStatement,
      {
        userid: body.userid,
        id_skupiny: body.id_skupiny,
        sprava: body.sprava,
        datum: body.datum,
        priloha: "EMPTY_BLOB()",
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

async function getOtherUsers(id_skupiny, id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select uc.userid, os.meno || ' ' || os.priezvisko as "meno", uc.historia from user_chat uc join zamestnanci z on (z.cislo_zam = uc.userid) 
      join os_udaje os on (z.rod_cislo = os.rod_cislo)
      where id_skupiny = :id_skupiny AND userid <> :id`,
      { id_skupiny, id }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function updateHistory(body) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `update user_chat set historia= :historia where userid =:userid AND id_skupiny =:id_skupiny`,
      {
        historia: body.historia,
        userid: body.userid,
        id_skupiny: body.id_skupiny,
      },
      { autoCommit: true }
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
  getObrazok,
  isAdmin,
  getOtherUsers,
  updateHistory,
};
