const port = 5000;

const express = require("express");
//ROUTES
const krajeRoute = require("./routes/krajeRoute");
const lekarRoute = require("./routes/lekarRoute");
const selectsRoute = require("./routes/selectsRoute");
const operaciaRoute = require("./routes/operaciaRoute");
const calendarRoute = require("./routes/calendarRoute");

const app = express();
app.use(express.json());

app.use("/kraje", krajeRoute);
app.use("/lekar", lekarRoute);
app.use("/selects", selectsRoute);
app.use("/operacia", operaciaRoute);
app.use("/calendar", calendarRoute);

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
