const port = 5000;

const express = require("express");

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));

app.use("/lekar", require("./routes/lekarRoute"));
app.use("/selects", require("./routes/selectsRoute"));
app.use("/calendar", require("./routes/calendarRoute"));
app.use("/patient", require("./routes/patientRoute"));
app.use("/add", require("./routes/addRoute"));
app.use("/auth", require("./routes/authRoute"));

app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
