const port = 5000;

const express = require("express");
//ROUTES
const routeKraje = require("./routes/krajeRoute");
const routeLekar = require("./routes/lekarRoute");

const app = express();


app.use("/kraje", routeKraje);
app.use("/lekar", routeLekar);

const database = require("./config/database.js");
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