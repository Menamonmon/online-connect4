const socketEvents = require("../../sockets/events");
const express = require("express");
const router = new express.Router();

router.get("/", (_, response) => {
  response.status(200).json(socketEvents);
});

module.exports = router;
