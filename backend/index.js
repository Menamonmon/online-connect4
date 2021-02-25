require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const types = require("./db/types");
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
const io = require("socket.io")(httpServer, socketIOOptions);

io.use(async (socket, next) => {
  // checking that this socket connection has a user
  const { user } = socket.handshake.auth;
  if (await doesUserExist(user)) {
    // attaching the socket id to the user
    socket.user = { ...user, socketID: socket.id };
    next();
  }
  return next(new Error("invalid user object"));
});

const activeUsers = [];

const broadcastActiveUsers = (sockets, users) => {
  for (const [_, socket] of sockets) {
    socket.emit(
      "auu",
      users.filter((u) => u.socketID !== socket.user.socketID)
    );
  }
};

io.on("connection", async (socket) => {
  // going through all of the users in the current socket and adding them to a list that would be updated for all the users
  const { user: currentUser } = socket;
  for (const [_, currentSocket] of io.sockets.sockets) {
    let { user } = currentSocket;
    if (
      user &&
      user.status === types.user.ACTIVE &&
      user.socketID === currentUser.socketID
    ) {
      console.log("USER CONNECTED");
      activeUsers.push(user);
    }
  }
  // broadcasting the signal to all of the sockets so that it's updated
  broadcastActiveUsers(io.sockets.sockets, activeUsers);

  socket.on("cuu", (updatedUser) => {
    for (let i = 0; i < activeUsers.length; i++) {
      let user = activeUsers[i];
      if (user.id === updatedUser.id) {
        activeUsers[i] = updatedUser;
        // broadcasing a list of the udapted active users
        broadcastActiveUsers(io.sockets.sockets, activeUsers);
      }
    }
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < activeUsers.length; i++) {
      let user = activeUsers[i];
      if (user.socketID === socket.id) {
        activeUsers.splice(i, 1);
        console.log("USER LOGGED OUT");
        // broadcasing a list of the udapted active users
        broadcastActiveUsers(io.sockets.sockets, activeUsers);
      }
    }
  });
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

const PORT = process.env.APP_PORT;
httpServer.listen(PORT, async () => {
  await initializeDatabase();
  console.log(`Starting Server At Port (${PORT})`);
});
