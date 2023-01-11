const port = 5000;

const express = require("express");

//ROUTES
const lekarRoute = require("./routes/lekarRoute");
const selectsRoute = require("./routes/selectsRoute");
const calendarRoute = require("./routes/calendarRoute");
const patientRoute = require("./routes/patientRoute");
const receptRoute = require("./routes/receptRoute");
const storageRoute = require("./routes/storageRoute");
const drugsRoute = require("./routes/drugsRoute");

const app = express();
app.use(express.json());

app.use("/lekar", lekarRoute);
app.use("/selects", selectsRoute);
app.use("/calendar", calendarRoute);
app.use("/patient", patientRoute);
app.use("/recept", receptRoute);
app.use("/sklad", storageRoute);
app.use("/drugs", drugsRoute);

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
