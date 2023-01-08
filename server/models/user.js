const database = require("../database/Database");

async function userExists(userid) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(`SELECT count(*) as pocet FROM user_tab where userid = :userid`, [userid]);

        if (result.rows[0].POCET === 1) {
            return true;
        }

        return false;
    } catch (err) {
        console.log(err);
    }
}

async function insertUser(body) {
    try {
        let conn = await database.getConnection();

        console.log(body);

        const result = await conn.execute(`insert into user_tab values(:userid, :pwd, :role)`,
            {
                userid: body.userid,
                pwd: body.pwd,
                role: body.role
            },
            { autoCommit: true }
        );

        console.log("Rows inserted " + result.rowsAffected);
    } catch (err) {
        console.log(err);
    }
}

async function getUser(userid) {
    try {
        let conn = await database.getConnection();

        const result = await conn.execute(`select * from user_tab where userid = :userid`,
            {
                userid: userid
            }
        );

        console.log(result.rows);
        return result.rows;
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    userExists,
    insertUser,
    getUser
};
