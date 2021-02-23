require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const {
  initializeDatabase,
  users: { doesUserExist },
} = require("./db/queries");
const app = express();
const httpServer = require("http").createServer(app);
const socketIOOptions = {
  cors: {
    origin: "http://localhost:3000",
  },
};
const socketEvents = require("./sockets/events");

const io = require("socket.io")(httpServer, socketIOOptions);

io.use(async (socket, next) => {
  // checking that this socket connection has a user
  const { user } = socket.handshake.auth;
  if (await doesUserExist(user)) {
    socket.user = user;
    next();
  }

  return next(new Error("invalid user object"));
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED");
  // going through all of the users in the current socket and adding them to a list that would be updated for all the users
  const activeUsers = [];
  for (const [socket] of io.of("/").sockets) {
    activeUsers.push(socket.user);
  }

  socket.emit(socketEvents.ACTIVE_USERS_UPDATED, activeUsers);
});

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/types", require("./routes/api/types"));
app.use("/users", require("./routes/api/users"));
app.use("/games", require("./routes/api/games"));
app.use("/socket-events", require("./routes/api/socketEvents"));

const PORT = process.env.APP_PORT;
httpServer.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Starting Server At Port (${PORT})`);
});
