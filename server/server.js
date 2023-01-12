const port = 5000;
const app = express();
const express = require('express');

//ROUTES
const lekarRoute = require('./routes/lekarRoute');
const selectsRoute = require('./routes/selectsRoute');
const calendarRoute = require('./routes/calendarRoute');
const patientRoute = require('./routes/patientRoute');
const receptRoute = require('./routes/receptRoute');
const storageRoute = require('./routes/storageRoute');
const drugsRoute = require('./routes/drugsRoute');
const medRecordsRoute = require('./routes/medRecordsRoute');
const addRoute = require('./routes/addRoute');

app.use(express.json());
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.json({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser()); //middleware for cookies

app.use('/auth', require('./routes/authRoute'));

app.use(verifyJWT);
app.use('/lekar', lekarRoute);
app.use('/selects', selectsRoute);
app.use('/calendar', calendarRoute);
app.use('/patient', patientRoute);
app.use('/recept', receptRoute);
app.use('/sklad', storageRoute);
app.use('/lieky', drugsRoute);
app.use('/zaznamy', medRecordsRoute);
app.use('/add', addRoute);
app.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
