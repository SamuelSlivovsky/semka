const database = require("../database/Database");

async function userExists(userid) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT count(*) as pocet FROM user_tab where userid = :userid`,
      [userid]
    );

    if (result.rows[0].POCET === 1) {
      return true;
    }

    return false;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function userExistsInDB(userid) {
  try {
    let conn = await database.getConnection();
    let result;
    if(!isNaN(userid)) {
      userid = Number(userid);
      result = await conn.execute(
          `SELECT count(*) as pocet FROM zamestnanci where cislo_zam = :userid`,
          [userid]
      );
    } else {
      result = await conn.execute(
          `SELECT count(*) as pocet FROM pacient where rod_cislo = :userid`,
          [userid]
      );
    }

    return result.rows[0].POCET === 0;


  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertUser(body) {
  try {
    let conn = await database.getConnection();


    const result = await conn.execute(
      `insert into user_tab values(:userid, :pwd, null, :role)`,
      {
        userid: body.userid,
        pwd: body.pwd,
        role: body.role,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getUserByUserId(userid) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `select * from user_tab where userid = :userid`,
      {
        userid: userid,
      }
    );

    console.log(result.rows);
    return result.rows[0];
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getUserByRefreshToken(refresh_token) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `select * from user_tab where refresh_token = :refresh_token`,
      {
        refresh_token: refresh_token,
      }
    );

    console.log(result.rows);
    return result.rows[0];
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function updateUserRefreshToken(body) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `update user_tab set refresh_token = :refresh_token where userid = :userid`,
      {
        refresh_token: body.refresh_token,
        userid: body.userid,
      },
      { autoCommit: true }
    );

    console.log("Rows updated " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  userExists,
  userExistsInDB,
  insertUser,
  getUserByUserId,
  getUserByRefreshToken,
  updateUserRefreshToken,
};
