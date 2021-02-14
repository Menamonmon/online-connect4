const { users, games} = require("./queries");

async function testUserQueries() {
  const newUser = await users.createUser("Mena");
  console.log(newUser);
  console.log(await users.getUserById(newUser.id));

  console.log("\n\n *** INSERT AND GET FOR USERS ARE OK *** \n\n");
  try {
    console.log(await users.getUserById(213123123));
  } catch (err) {
    console.log(err);
  }
  const updatedUser = await users.updateUserName(newUser.id, "Masio");
  console.log(updatedUser, await users.getUserById(newUser.id));

  console.log("**** UPDATING TESTED");

  console.log(await users.deleteUser(updatedUser.id));
  pool.end();
}

async function testGameQueries() {
  // Creating 2 user for the game
  const user1 = await games.createUser("Mena");
  const user2 = await games.createUser("Masio");
  const game = await games.createGame(user1.id, user2.id);
  console.log(game);
  const user3 = await games.createUser("Meret");
  const game2 = await games.createGame(user3.id, user1.id);
  console.log(await games.getGamesByPlayerId(user1.id));

  const updatedGame = await games.updateGameState(
    game2.id,
    "121220000000000000000000000000000000"
  );
  const updatedGame2 = await games.updateGameStatus(
    game2.id,
    types.gameStateTypes.ENDED
  );
  console.log(updatedGame);
  console.log(updatedGame2);
  await pool.end();
}

testUserQueries();
testGameQueries();
