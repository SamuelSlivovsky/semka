const port = 5000;

const express = require("express");

//ROUTES
const lekarRoute = require("./routes/lekarRoute");
const selectsRoute = require("./routes/selectsRoute");
const patientRoute = require("./routes/patientRoute");

const app = express();
app.use(express.json());

app.use("/lekar", lekarRoute);
app.use("/selects", selectsRoute);
app.use("/patient", patientRoute);

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
