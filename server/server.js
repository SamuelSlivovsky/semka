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
        return data;
    } catch (err) {
        console.log(err);
    }
}
const data = fun();


app.get("/api", (req, res) => {
    res.json(data)
})


app.listen(port, () => {
    console.log(`Aplikacia bezi na porte ${port}`);
})