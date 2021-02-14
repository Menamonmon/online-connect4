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
  const { newState, newStatus } = request.body;
  let newGame = {};

  if (newState) {
    try {
      newGame = await db.updateGameState(gameId, newState);
    } catch (err) {
      response.status(400).json({ msg: err.message });
      return;
    }
  } else if (newStatus) {
    try {
      newGame = await db.updateGameStatus(gameId, newStatus);
    } catch (err) {
      response.status(400).json({ msg: err.message });
      return;
    }
  }
  if (newState || newStatus) {
    response.status(200).json(newGame);
    return;
  }
  response.status(400).json({
    msg: "You can only update either the state or the status of the game",
  });
});

module.exports = router;