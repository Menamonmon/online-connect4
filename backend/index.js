require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const types = require("./db/types");
const {
  initializeDatabase,
  users: { doesUserExist },
  games: gamesDB,
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

const initializeGame = async (currentUserSocket, invitedUserSocket) => {
  const [player1, player2] = [currentUserSocket.user, invitedUserSocket.user];
  let game = null;
  try {
    game = await gamesDB.createGame(player1.id, player2.id);
  } catch (err) {
    console.log(err);
  }

  if (game === null) {
    invitedUserSocket.emit("connection_error");
    currentUserSocket.emit("connection_error");
    console.log(
      `ERROR IN CREATING GAME FOR USERS: ${player1.id} and ${player2.id}`
    );
  }

  const gameRoomName = `game:${game.id}`;
  currentUserSocket.leave("lobby");
  invitedUserSocket.leave("lobby");
  currentUserSocket.join(gameRoomName);
  invitedUserSocket.join(gameRoomName);
  currentUserSocket.emit("game created", {
    game,
    currentUser: player1,
    invitedUser: player2,
  });
  invitedUserSocket.emit("game created", {
    game,
    currentUser: player2,
    invitedUser: player1,
  });
};

const endGameHandler = (socket) => {
  // taking the user out of all the game rooms and notifying the rest of the users in the room that the game ended
  for (const room of socket.rooms) {
    if (room.startsWith("game")) {
      // leaving the room and notifying all of the other players in the
      // room that the game was ended because one of the users left
      io.in(room).sockets.emit("game has ended");
      console.log(io.in(room).sockets);
      for (const [id, currentSocket] of io.in(room).sockets.sockets) {
        if (id === socket.id) {
          currentSocket.leave(room);
        } else {
          currentSocket.leave(room);
          currentSocket.join("lobby");
        }
      }
    }
  }
};

io.on("connection", async (socket) => {
  // going through all of the users in the current socket and adding them to a list that would be updated for all the users
  const { user: currentUser } = socket;
  socket.join("lobby");
  for (const [_, invitedUserSocket] of io.in("lobby").of("/").sockets) {
    let { user } = invitedUserSocket;
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
  broadcastActiveUsers(io.in("lobby").of("/").sockets, activeUsers);

  socket.on("cuu", (updatedUser) => {
    for (let i = 0; i < activeUsers.length; i++) {
      let user = activeUsers[i];
      if (user.id === updatedUser.id) {
        activeUsers[i] = updatedUser;
        // broadcasing a list of the udapted active users
        broadcastActiveUsers(io.in("lobby").of("/").sockets, activeUsers);
        break;
      }
    }
  });

  socket.on("update game", (newGame) => {
    const gameRoomName = `game:${newGame.id}`;
    socket.to(gameRoomName).emit("game has changed", newGame);
  });

  socket.on("invite user", (invitedUser) => {
    for (const [socketID, invitedUserSocket] of io.sockets.sockets) {
      if (socketID === invitedUser.socketID) {
        // If this is the socket for the invitedUser then notify that user's client about the invitation
        invitedUserSocket.emit("notify of invite", socket.user);

        // Event handlers for the acceptance and rejection of invite
        const inviteAcceptedHandler = async () => {
          socket.emit("invited user accepted invite");

          // initializing the game once the user accepts the invitation
          await initializeGame(socket, invitedUserSocket);

          invitedUserSocket.off("invite accepted", inviteAcceptedHandler);
          invitedUserSocket.off("invite rejected", inviteAcceptedHandler);
        };
        invitedUserSocket.on("invite accepted", inviteAcceptedHandler);

        const inviteRejectedHandler = () => {
          socket.emit("invited user rejected invite");
          invitedUserSocket.off("invite rejected", inviteAcceptedHandler);
          invitedUserSocket.off("invite accepted", inviteAcceptedHandler);
        };
        invitedUserSocket.on("invite rejected", inviteRejectedHandler);
        break;
      }
    }
  });

  socket.on("disconnecting", () => {
    console.log("USER SOCKET ROOMS FOR USER BEIGN LOGGED OUT: ", socket.rooms);
    endGameHandler(socket);
  });

  socket.on("disconnect", () => {
    for (let i = 0; i < activeUsers.length; i++) {
      let user = activeUsers[i];
      if (user.socketID === socket.id) {
        activeUsers.splice(i, 1);
        console.log("USER LOGGED OUT");

        // broadcasing a list of the udapted active users
        broadcastActiveUsers(io.in("lobby").of("/").sockets, activeUsers);
        break;
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
