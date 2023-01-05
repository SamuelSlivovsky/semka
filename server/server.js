const port = 5000;

const express = require("express");
//ROUTES
const krajeRoute = require("./routes/KrajeRoute");
const lekarRoute = require("./routes/LekarRoute");
const hospitalziaciaRout = require("./routes/hospitalizacieRoute");

const database = require("./database/Database");

const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors);

app.use("/kraje", krajeRoute);
app.use("/lekar", lekarRoute);
app.use("/hospitalizacie", hospitalziaciaRout);

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
testJSON();

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
