const port = 5000;

const express = require("express");
const app = express();

const routeKraje = require("./routes/krajeRoute");
app.use("/kraje", routeKraje);

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