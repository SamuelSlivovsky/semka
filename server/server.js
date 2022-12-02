const port = 5000;

const express = require("express");
//ROUTES
const krajeRoute = require("./routes/krajeRoute");
const lekarRoute = require("./routes/lekarRoute");
const selectsRoute = require("./routes/selectsRoute");
const operaciaRoute = require("./routes/operaciaroute");

const database = require("./database/Database");

const app = express();
app.use(express.json());

app.use("/kraje", krajeRoute);
app.use("/lekar", lekarRoute);
app.use("/selects", selectsRoute);
app.use("/operacia", operaciaRoute);

const oracledb = database.oracledb;

const sqlStatement = `BEGIN
    get_pacient_json(1, :ret);
END;`;

async function testJSON() {
  try {
    var bindvars = {
      ret: { dir: oracledb.BIND_OUT, type: oracledb.JSON },
    };
    const conn = await database.getConnection();
    let json = await conn.execute(sqlStatement, bindvars);
    console.log(json.outBinds.ret);
  } catch (err) {
    console.error(err);

    process.exit(1); // Non-zero failure code
  }
}
//testJSON();

// const sqlStatement2 = `BEGIN
//     :ret := getxml_f();
// END;`;

// oracledb.fetchAsString = [ oracledb.CLOB ];

// async function testXML() {
//     try {
//         const conn = await database.getConnection();
//         let xml = await conn.execute(sqlStatement2, {
//             ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1073741824 }
//         })
//         console.log(xml.outBinds.ret);
//     } catch (err) {
//         console.error(err);

//         process.exit(1); // Non-zero failure code
//     }
// }
// testXML();

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
