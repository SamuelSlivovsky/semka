const express = require("express");
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('orcl.fri.uniza.sk', 'labat_sp', 'heslo1234', {
    host: 'obelix.fri.uniza.sk',
    port: 1521,
    dialect: 'oracle'
});

const app = express();
const port = 5000;

const oracledb = require('oracledb');
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
// try {
//     oracledb.initOracleClient({ libDir: 'C://oracle//instantclient_21_7' });
// } catch (err) {
//     console.error('Whoops!');
//     console.error(err);
//     process.exit(1);
// }
async function fun() {
    try {
        con = await oracledb.getConnection({
            user: 'labat_sp',
            password: 'heslo1234',
            connectString: 'obelix.fri.uniza.sk:1521/orcl.fri.uniza.sk'
        });
        const data = await con.execute(
            'SELECT * FROM kraj'
        );
        console.log(data.rows);
    } catch (err) {
        console.log(err);
    }
}
fun();
// app.get("/", (req, res) => {
//     res.send("Hello world!");
// })

// const results = sequelize.query('SELECT * FROM kraj');
// console.log(results);
// console.log("a");
// app.get("/kraj", (req, res) => {
//     const results = sequelize.query("SELECT * FROM kraj");
//     res.send(results);
// })

// sequelize.sync({ force: true });

app.listen(port, () => {
    console.log(`Aplikacia bezi na porte ${port}`);
})