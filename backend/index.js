require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { initializeDatabase } = require("./db/queries");
const app = express();
const httpServer = require("http").createServer(app);
const socketIOOptions = {
  cors: {
    origin: "http://localhost:3000",
  }
};
const io = require("socket.io")(httpServer, socketIOOptions);

io.on("connection", socket => {
  console.log("A CONNECTION HAS BEEN MADE");
})

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
