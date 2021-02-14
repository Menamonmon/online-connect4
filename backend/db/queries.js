require("dotenv").config({ path: __dirname + "./../.env" });
const types = require("./types");
const { createTables } = require("./init");
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  host: process.env.PSQL_HOST,
  port: process.env.PSQL_PORT,
  database: process.env.PSQL_DB,
});

createTables(pool);

async function getUserById(id) {
  const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (results.rowCount !== 1) {
    throw Error(`User with id "${id}" is not found`);
  }
  return results.rows[0];
}

async function getActiveUsers(currentUserId) {
  const results = await pool.query(
    "SELECT * FROM users WHERE (NOT id = $1) AND status = $2",
    [currentUserId, types.userStateTypes.ACTIVE]
  );

  return await results.rows;
}

async function createUser(name) {
  const results = await pool.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING *",
    [name]
  );
  if (results.rowCount === 0) {
    throw Error("Problem with creating user");
  }
  return results.rows[0];
}

async function deleteUser(id) {
  const results = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );

  if (results.rowCount !== 1) {
    throw Error("Problem with deleting user");
  }

  return results.rows[0];
}

async function updateUserName(id, newName) {
  const results = await pool.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
    [newName, id]
  );
  if (results.rowCount !== 1) {
    throw Error("Problem with updating user");
  }
  return results.rows[0];
}

async function updateUserStatus(id, newStatus) {
  if (!Object.values(types.userStateTypes).includes(newStatus)) {
    throw Error("Invalid User State Type");
  }

  const results = await pool.query(
    "UPDATE users SET status = $1 WHERE id = $2 RETURNING *",
    [newState, id]
  );

  if (results.rowCount !== 1) {
    throw Error("Problem with updating user's status");
  }

  return results.rows[0];
}

async function getGamesByPlayerId(playerId) {
  const results = await pool.query(
    "SELECT * FROM games WHERE player_1_id = $1 OR player_2_id = $1",
    [playerId]
  );

  return results.rows;
}

async function updateGameState(gameId, newState) {
  const results = await pool.query(
    "UPDATE games SET state = $1 WHERE id = $2 RETURNING *",
    [newState, gameId]
  );

  if (results.rowCount !== 1) {
    throw Error("Invalid game ID or state does not match requirements");
  }

  return results.rows[0];
}

async function updateGameStatus(gameId, newStatus) {
  const results =
    newStatus === types.gameStateTypes.ENDED
      ? await pool.query(
          "UPDATE games SET status = $1, ended_at = NOW() WHERE id = $2 RETURNING *",
          [newStatus, gameId]
        )
      : await pool.query(
          "UPDATE games SET status = $1 WHERE id = $2 RETURNING *",
          [newStatus, gameId]
        );

  if (results.rowCount !== 1) {
    throw Error("Invalid game ID or state does not match requirements");
  }

  return results.rows[0];
}

async function createGame(player1Id, player2Id) {
  const results = await pool.query(
    "INSERT INTO games (player_1_id, player_2_id) VALUES ($1, $2)RETURNING *",
    [player1Id, player2Id]
  );

  if (results.rowCount !== 1) {
    throw Error("Game cannot be created");
  }

  return results.rows[0];
}

module.exports = {
  users: {
    getUserById,
    getActiveUsers,
    createUser,
    updateUserName,
    updateUserStatus,
    deleteUser,
  },
  games: {
    getGamesByPlayerId,
    createGame,
    updateGameState,
    updateGameStatus,
  },
};
