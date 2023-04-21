const port = 5000;
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
//ROUTES
const lekarRoute = require("./routes/lekarRoute");
const selectsRoute = require("./routes/selectsRoute");
const calendarRoute = require("./routes/calendarRoute");
const patientRoute = require("./routes/patientRoute");
const receptRoute = require("./routes/receptRoute");
const storageRoute = require("./routes/storageRoute");
const drugsRoute = require("./routes/drugsRoute");
const medRecordsRoute = require("./routes/medRecordsRoute");
const addRoute = require("./routes/addRoute");
const lozkoRoute = require("./routes/lozkoRoute");
const equipmentRoute = require("./routes/equipmentRoute");

app.use(credentials);
//app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(cookieParser()); //middleware for cookies

app.use("/auth", require("./routes/authRoute"));
app.use(verifyJWT);
app.use("/sklad", storageRoute);
app.use("/lekar", lekarRoute);
app.use("/selects", selectsRoute);
app.use("/calendar", calendarRoute);
app.use("/patient", patientRoute);
app.use("/recept", receptRoute);
app.use("/lieky", drugsRoute);
app.use("/zaznamy", medRecordsRoute);
app.use("/add", addRoute);
app.use("/lozko", lozkoRoute);
app.use("/vybavenie", equipmentRoute);
app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
