const port = 5000;

const express = require("express");
//ROUTES
const krajeRoute = require("./routes/KrajeRoute");
const lekarRoute = require("./routes/LekarRoute");

const database = require("./database/Database");

const app = express();
app.use(express.json());


app.use("/kraje", krajeRoute);
app.use("/lekar", lekarRoute);


// async function testInit() {
//     try {
//         console.log("Initializing database module");

//         await database.initialize();
//     } catch (err) {
//         console.error(err);

//         process.exit(1); // Non-zero failure code
//     }
// }
// testInit();

const oracledb = database.oracledb;


async function testJSON() {
    try {
        var bindvars = {
            ret: { dir: oracledb.BIND_OUT, type: oracledb.JSON }
        };
        const conn = await database.getOracleConnection();
        let json = await conn.execute("begin :ret := get_pacient_json(2);", bindvars);
        console.log(json);
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }
}
testJSON();


app.listen(port, () => {
    console.log(`Aplikacia bezi na porte ${port}`);
})