require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.raw());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/types", require("./routes/api/types"));
app.use("/users", require("./routes/api/users"));
app.use("/games", require("./routes/api/games"));

app.get("/", (_, response) => {
  response.send("Hello World");
});

const PORT = process.env.APP_PORT;
app.listen(PORT, () => {
  console.log(`Starting Server At Port (${PORT})`);
});
