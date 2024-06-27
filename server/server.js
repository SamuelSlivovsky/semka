const port = 5000;
const express = require("express");
const http = require("http"); // Import the HTTP module
const socketIo = require("socket.io"); // Import Socket.io
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");
// ROUTES
const lekarRoute = require("./routes/lekarRoute");
const logRoute = require("./routes/logRoute");
const pharmacyManagersRoute = require("./routes/pharmacyManagersRoute");
const pharmacyStorageRoute = require("./routes/pharmacyStorageRoute");
const pharmacyPrescriptionsRoute = require("./routes/PharmacyPrescriptionsRoute");
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
const updateRoute = require("./routes/updateRoute");
const chatRoute = require("./routes/chatRoute");
const hospitalizaciaRoute = require("./routes/hospitalizacieRoute");
const poistovnaRoute = require("./routes/poistovnaRoute");
const ordersRoute = require("./routes/ordersRoute");
const warehouseTransfersRoute = require("./routes/warehouseTransfersRoute");
const warehouseStatistics = require("./routes/warehouseStatisticsRoute");
// Set session date format
async function setSessionDateFormat() {
  const database = require("./database/Database");
  try {
    const connection = await database.getConnection();

    await connection.execute(
      "ALTER SESSION SET NLS_DATE_FORMAT = 'DD/MM/YYYY HH24:MI:SS'"
    );

    console.log("Session date format set successfully.");
    await connection.close();
  } catch (err) {
    console.error("Error setting session date format:", err);
  }
}

// Call the function to set session date format
setSessionDateFormat();
const vehicleRoute = require("./routes/vehicleRoute");
const departureRoute = require("./routes/vyjazdyRoute")

const server = http.createServer(app); // Create an HTTP server using your Express app
const io = socketIo(server); // Initialize Socket.io with the HTTP server

app.use(credentials);
// app.use(cors(corsOptions)); // You can add this back if needed
app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);

app.use(cookieParser()); // Middleware for cookies
app.use("/auth", require("./routes/authRoute"));
app.use(verifyJWT);
app.use("/logs", logRoute);
app.use("/sklad", storageRoute);
app.use("/lekarenskySklad", pharmacyStorageRoute);
app.use("/lekar", lekarRoute);
app.use("/pharmacyManagers", pharmacyManagersRoute);
app.use("/pharmacyPrescriptions", pharmacyPrescriptionsRoute);
app.use("/selects", selectsRoute);
app.use("/calendar", calendarRoute);
app.use("/patient", patientRoute);
app.use("/recept", receptRoute);
app.use("/lieky", drugsRoute);
app.use("/zaznamy", medRecordsRoute);
app.use("/add", addRoute);
app.use("/lozko", lozkoRoute);
app.use("/vybavenie", equipmentRoute);
app.use("/update", updateRoute);
app.use("/chat", chatRoute);
app.use("/hospitalizacia", hospitalizaciaRoute);
app.use("/poistovna", poistovnaRoute);
app.use("/objednavky", ordersRoute);
app.use("/presuny", warehouseTransfersRoute);
app.use("/skladStatistiky", warehouseStatistics);

const users = {};
app.use("/vozidla", vehicleRoute);
app.use("/vyjazdy", departureRoute)

io.on("connection", (socket) => {
  socket.emit("yourSocketId", socket.id);

  socket.on("storeUserData", ({ userId, group }) => {
    users[userId] = {
      socketId: socket.id,
      group: group,
    };
  });

  socket.on("sendMessage", (message, params) => {
    const groupUsers = Object.values(users).filter(
      (user) => user.group == params.groupId
    );

    groupUsers.forEach((user) => {
      io.to(user.socketId).emit("newMessage", {
        content: message,
        sender: params.userId,
        image: params.image,
        type: "text",
      });
    });
  });

  socket.on("typing", (params) => {
    const groupUsers = Object.values(users).filter(
      (user) => user.group == params.groupId
    );
    groupUsers.forEach((user) => {
      io.to(user.socketId).emit("isTyping", {
        id: params.userId,
        isEmpty: params.isEmpty,
      });
    });
  });

  socket.on("disconnect", () => {
    const userId = Object.keys(users).find(
      (key) => users[key].socketId === socket.id
    );
    if (userId) {
      delete users[userId];
    }
  });
});

server.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
