require("dotenv").config();
const express = require("express");
const cors = require("cors");
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
    origins: ["http://localhost:3000", "http://10.0.0.218:3000"],
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

const broadcastActiveUsers = (sockets) => {
  const users = [];
  for (const [_, socket] of sockets) {
    users.push(socket.user);
  }
  for (const [_, socket] of sockets) {
    socket.emit(
      "auu",
      users.filter(
        (u) =>
          u.socketID !== socket.user.socketID && u.status === types.user.ACTIVE
      )
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
  currentUserSocket.game = game;
  invitedUserSocket.game = game;
};

const endGameHandler = async (socket, finalGame) => {
  console.log(finalGame);
  let isErrorWithSaving = false;
  let error = null;
  if (finalGame && finalGame !== {}) {
    const gameID = finalGame.id;
    updatedGame = {
      state: finalGame.state,
      status: types.game.ENDED,
      current_player: finalGame.current_player,
      winner: finalGame.winner,
    };
    try {
      await gamesDB.updateGame(gameID, updatedGame);
    } catch (err) {
      isErrorWithSaving = true;
      error = err.message;
    }
  }

  // taking the user out of all the game rooms and notifying the rest of the users in the room that the game ended
  for (const room of socket.rooms) {
    if (room.startsWith("game")) {
      // leaving the room and notifying all of the other players in the
      // room that the game was ended because one of the users left
      socket.to(room).emit("game has ended");
      if (isErrorWithSaving) {
        io.in(room).emit("error with saving game", error);
      }
      for (const [id, currentSocket] of io.in(room).sockets.sockets) {
        if (id !== socket.id) {
          currentSocket.leave(room);
          currentSocket.join("lobby");
          currentSocket.user.status = types.user.ACTIVE;
        }
      }
    }
  }
};

const logoutSocket = (socket) => {
  for (const room of socket.rooms) {
    socket.leave(room);
  }
};

io.on("connection", async (socket) => {
  // going through all of the users in the current socket and adding them to a list that would be updated for all the users
  socket.join("lobby");
  // broadcasting the signal to all of the sockets so that it's updated
  broadcastActiveUsers(io.in("lobby").of("/").sockets);

  socket.on("cuu", (updatedUser) => {
    for (const [id, s] of io.in("lobby").of("/").sockets) {
      if (id === updatedUser.id) {
        s.user = updatedUser;
        console.log("USER UPDATED");
        broadcastActiveUsers(io.in("lobby").of("/").sockets);
        break;
      }
    }
  });

  socket.on("update game", (newGame) => {
    const gameRoomName = `game:${newGame.id}`;
    socket.to(gameRoomName).emit("game has changed", newGame);
    for (const [id, socket] of io.in(gameRoomName).of("/").sockets) {
      socket.game = newGame;
    }
  });

  socket.on("invite user", (invitedUser) => {
    const invitedUserSocket = io
      .in("lobby")
      .of("/")
      .sockets.get(invitedUser.socketID);
    // If this is the socket for the invitedUser then notify that user's client about the invitation
    // Switching the users to inactive temporarily so that they don't appear on the
    // active users list for the others
    socket.user.status = types.user.INACTIVE;
    invitedUserSocket.user.status = types.user.INACTIVE;
    broadcastActiveUsers(io.in("lobby").of("/").sockets);

    invitedUserSocket.emit("notify of invite", socket.user);

    // Event handlers for the acceptance and rejection of invite
    const inviteAcceptedHandler = async () => {
      socket.emit("invited user accepted invite");

      // initializing the game once the user accepts the invitation
      await initializeGame(socket, invitedUserSocket);

      invitedUserSocket.off("invite accepted", inviteAcceptedHandler);
      invitedUserSocket.off("invite rejected", inviteRejectedHandler);
    };
    invitedUserSocket.on("invite accepted", inviteAcceptedHandler);

    const inviteRejectedHandler = () => {
      socket.emit("invited user rejected invite");

      // Reactivating the status for the users if the invite is rejected
      socket.user.status = types.user.ACTIVE;
      invitedUserSocket.user.status = types.user.ACTIVE;
      broadcastActiveUsers(io.in("lobby").of("/").sockets);

      invitedUserSocket.off("invite rejected", inviteRejectedHandler);
      invitedUserSocket.off("invite accepted", inviteAcceptedHandler);
    };
    invitedUserSocket.on("invite rejected", inviteRejectedHandler);
    invitedUserSocket.on("disconnect", inviteRejectedHandler); // reject when invited user is disconnected

    // set a timeout for user to accept invite so that the other user does not wait forever
    setTimeout(() => {
      invitedUserSocket.emit("invite canceled");
    }, 120000);
  });

  socket.on("end game", async (finalGame) => {
    await endGameHandler(socket, finalGame);
    for (const room of socket.rooms) {
      if (room !== "lobby") socket.leave(room);
    }
    console.log(finalGame.id);
    socket.emit("clear game");
    socket.user.status = types.user.ACTIVE;
    broadcastActiveUsers(io.in("lobby").of("/").sockets);
  });

  socket.on("disconnecting", async () => {
    console.log(socket.game);
    await endGameHandler(socket, socket.game);
    logoutSocket(socket);
  });

  socket.on("disconnect", () => {
    console.log("USER LOGGED OUT");
    // broadcasing a list of the udapted active users
    broadcastActiveUsers(io.in("lobby").of("/").sockets);
  });
});

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.raw());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use("/types", require("./routes/api/types"));
app.use("/users", require("./routes/api/users"));
app.use("/games", require("./routes/api/games"));

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";
httpServer.listen(PORT, HOST, async () => {
  await initializeDatabase();
  console.log(`Starting Server At (${PORT})`);
});
