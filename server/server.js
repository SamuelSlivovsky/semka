const port = 5000

const cors = require('cors');
const express = require("express");
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');

const app = express();

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json({ extended: true, limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser()); //middleware for cookies

app.use("/auth", require("./routes/authRoute"));

app.use(verifyJWT);
app.use("/lekar", require("./routes/lekarRoute"));
app.use("/selects", require("./routes/selectsRoute"));
app.use("/calendar", require("./routes/calendarRoute"));
app.use("/patient", require("./routes/patientRoute"));
app.use("/add", require("./routes/addRoute"));


app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
