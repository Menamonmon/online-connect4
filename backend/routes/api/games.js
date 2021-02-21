const express = require("express");
const router = new express.Router();
const { games: db } = require("../../db/queries");

router.post("/create", async (request, response) => {
  const { player1Id, player2Id } = request.body;
  let newGame = {};
  try {
    newGame = await db.createGame(player1Id, player2Id);
  } catch (err) {
    response.status(400).json({ msg: err.message });
    return;
  }
  response.status(200).json(newGame);
});

router.get("/user/:id", async (request, response) => {
  const userId = request.params.id;
  let gamesList = [];
  try {
    gamesList = await db.getGamesByPlayerId(userId);
  } catch (err) {
    response.status(400).json({ msg: err.message });
  }

  response.status(200).json(gamesList);
});

router.put("/:id", async (request, response) => {
  const gameId = request.params.id;
  const newGame = request.body;
  if (newGame.id !== undefined || newGame.id !== null) {
    if (gameId !== newGame.id) {
      response
        .status(400)
        .json({ msg: "The game ID must match the URL parameter ID" });
      return;
    }

    delete newGame.id;
  }

  const updatedGame = {};

  try {
    updatedGame = await db.updateGame(gameId, newGame);
  } catch (err) {
    response.status(400).json({ msg: err.message });
    return;
  }

  response.status(200).json(updatedGame);
});

module.exports = router;
