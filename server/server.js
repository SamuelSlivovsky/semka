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
app.use("/update", updateRoute);

io.on("connection", (socket) => {
  console.log(socket);
  socket.emit("yourSocketId", socket.id);
  // Listen for text messages
  socket.on("sendMessage", (message, groupName) => {
    // Broadcast the text message to all connected clients
    io.emit("newMessage", {
      content: message,
      sender: socket.id,
      type: "text",
    });
  });

  // Listen for image messages
  socket.on("sendImage", (image, groupName) => {
    // Broadcast the image message to all connected clients
    io.emit("newMessage", { content: image, sender: socket.id, type: "image" });
  });

  socket.on("disconnect", () => {
    // Handle disconnection if needed
  });
});

server.listen(port, () => {
  console.log(`Aplikacia bezi na porte ${port}`);
});
