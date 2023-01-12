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
const medRecordsRoute = require("./routes/medRecordsRoute");
const { autoCommit } = require("oracledb");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/lekar", lekarRoute);
app.use("/selects", selectsRoute);
app.use("/calendar", calendarRoute);
app.use("/patient", patientRoute);
app.use("/recept", receptRoute);
app.use("/sklad", storageRoute);
app.use("/lieky", drugsRoute);
app.use("/zaznamy", medRecordsRoute);

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
