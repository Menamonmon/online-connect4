const express = require("express");
const router = new express.Router();
const types = require("../../db/types");

router.get("/", async (request, response) => {
  response.status(200).send(types);
});

module.exports = router;
