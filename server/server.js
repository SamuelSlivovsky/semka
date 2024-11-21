const port = 5000;
const express = require('express');
const http = require('http'); // Import the HTTP module
const socketIo = require('socket.io'); // Import Socket.io
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const credentials = require('./middleware/credentials');
// ROUTES
const lekarRoute = require('./routes/lekarRoute');
const logRoute = require('./routes/logRoute');
const selectsRoute = require('./routes/selectsRoute');
const calendarRoute = require('./routes/calendarRoute');
const patientRoute = require('./routes/patientRoute');
const receptRoute = require('./routes/receptRoute');
const storageRoute = require('./routes/storageRoute');
const drugsRoute = require('./routes/drugsRoute');
const medRecordsRoute = require('./routes/medRecordsRoute');
const addRoute = require('./routes/addRoute');
const lozkoRoute = require('./routes/lozkoRoute');
const equipmentRoute = require('./routes/equipmentRoute');
const nemocnicaRoute = require('./routes/nemocnicaRoute');
const miestnostRoute = require('./routes/miestnostRoute');
const updateRoute = require('./routes/updateRoute');
const chatRoute = require('./routes/chatRoute');
const ordersRoute = require('./routes/ordersRoute');
const warehouseTransfersRoute = require('./routes/warehouseTransfersRoute');
const hospitalizaciaRoute = require('./routes/hospitalizacieRoute');

const server = http.createServer(app); // Create an HTTP server using your Express app
const io = socketIo(server); // Initialize Socket.io with the HTTP server

app.use(credentials);
// app.use(cors(corsOptions)); // You can add this back if needed
app.use(express.json({ limit: '50mb' }));
app.use(
  express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 })
);

app.use(cookieParser()); // Middleware for cookies

app.use('/auth', require('./routes/authRoute'));
app.use(verifyJWT);
app.use('/logs', logRoute);
app.use('/sklad', storageRoute);
app.use('/lekar', lekarRoute);
app.use('/selects', selectsRoute);
app.use('/calendar', calendarRoute);
app.use('/patient', patientRoute);
app.use('/recept', receptRoute);
app.use('/lieky', drugsRoute);
app.use('/zaznamy', medRecordsRoute);
app.use('/add', addRoute);
app.use('/lozko', lozkoRoute);
app.use('/vybavenie', equipmentRoute);
app.use('/update', updateRoute);
app.use('/chat', chatRoute);
app.use('/objednavky', ordersRoute);
app.use('/presuny', warehouseTransfersRoute);
app.use('/hospitalizacia', hospitalizaciaRoute);
app.use('/nemocnica', nemocnicaRoute);
app.use('/miestnost', miestnostRoute);

io.on('connection', (socket) => {
  socket.emit('yourSocketId', socket.id);
  socket.on('sendMessage', (message, params) => {
    io.emit('newMessage', {
      content: message,
      image: params.image,
      sender: params.userId,
      type: 'text',
    });
  });

  // socket.on("sendImage", (image, params) => {
  //   io.emit("newMessage", {
  //     content: image,
  //     sender: params.userId,
  //     type: "image",
  //   });
  // });

  socket.on('disconnect', () => {});
  socket.on('typing', (params) => {
    io.emit('isTyping', {
      id: params.userId,
      isEmpty: params.isEmpty,
    });
  });
});

server.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
