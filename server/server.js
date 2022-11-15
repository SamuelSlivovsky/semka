const port = 5000;

const express = require("express");
//ROUTES
const krajeRoute = require("./routes/KrajeRoute");
const lekarRoute = require("./routes/LekarRoute");

const database = require("./database/Database");

const app = express();

app.use("/kraje", krajeRoute);
app.use("/lekar", lekarRoute);


async function testInit() {
    try {
        console.log("Initializing database module");

        await database.initialize();
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }
}
testInit();


app.listen(port, () => {
    console.log(`Aplikacia bezi na porte ${port}`);
})