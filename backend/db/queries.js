require("dotenv").config({ path: __dirname + "./../.env" });
const types = require("./types");
const { initDB } = require("./init");
const { Pool } = require("pg");

const DEBUG = process.env.DEBUG === "true";
const dbConfig = DEBUG
  ? {
      user: process.env.PSQL_USER,
      database: process.env.PSQL_DATABASE,
      password: process.env.PSQL_PASSWORD,
      port: process.env.PSQL_PORT,
      host: process.env.PSQL_HOST,
    }
  : {
      connectionString: process.env.DATABASE_URL,
    };
console.log(dbConfig);

const pool = new Pool(dbConfig);

const areUsersEqual = (user1, user2) =>
  JSON.stringify(user1) === JSON.stringify(user2);

async function getUserById(id) {
  const results = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  if (results.rowCount !== 1) {
    throw new Error(`User with id "${id}" is not found`);
  }
  return results.rows[0];
}

async function doesUserExist(user) {
  let existingUser = null;
  try {
    existingUser = await getUserById(user.id);
  } catch (err) {
    return false;
  }

  if (existingUser === null || !areUsersEqual(existingUser, user)) {
    return false;
  }
  return true;
}

async function getActiveUsers(currentUserId) {
  const results = await pool.query(
    "SELECT * FROM users WHERE (NOT id = $1) AND status = $2",
    [currentUserId, types.user.ACTIVE]
  );

  return await results.rows;
}

async function createUser(name) {
  const results = await pool.query(
    "INSERT INTO users (name) VALUES ($1) RETURNING *",
    [name]
  );
  if (results.rowCount === 0) {
    throw new Error("Problem with creating user");
  }
  return results.rows[0];
}

async function deleteUser(id) {
  const results = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );

  if (results.rowCount !== 1) {
    throw new Error("Problem with deleting user");
  }

  return results.rows[0];
}

async function updateUserName(id, newName) {
  const results = await pool.query(
    "UPDATE users SET name = $1 WHERE id = $2 RETURNING *",
    [newName, id]
  );
  if (results.rowCount !== 1) {
    throw new Error("Problem with updating user");
  }
  return results.rows[0];
}

async function updateUserStatus(id, newStatus) {
  if (!Object.values(types.user).includes(newStatus)) {
    throw new Error("Invalid User State Type");
  }

  const results = await pool.query(
    "UPDATE users SET status = $1 WHERE id = $2 RETURNING *",
    [newState, id]
  );

  if (results.rowCount !== 1) {
    throw new Error("Problem with updating user's status");
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

async function getGameById(gameId) {
  const results = await pool.query("SELECT * FROM games WHERE id = $1", [
    gameId,
  ]);

  if (results.rowCount !== 1) {
    throw new Error("Invalid Game ID");
  }

  return results.rows[0];
}

async function updateGame(gameId, newGame) {
  function validateGame(newGame) {
    const mutables = ["state", "status", "current_player", "winner"];
    if (Object.keys(newGame).some((a) => !mutables.includes(a))) {
      invalidCause = "One of the fields is immutable and can't be updated";
      return false;
    } else if (newGame.status) {
      if (!Object.values(types.game).includes(newGame.status)) {
        invalidCause = "Invalid game status value";
        return false;
      }
    } else if (newGame.state) {
      const uniqueCellsSet = new Set(newGame.state.split("")).values();
      const uniqueCells = Array(...uniqueCellsSet);
      if (uniqueCells.some((a) => !Object.values(types.cell).includes(a))) {
        invalidCause = "One of the cell values are invalid";
        return false;
      }
    }

    return true;
  }

  if (!validateGame(newGame)) {
    throw new Error(`Invalid Game Shape: ${invalidCause}`);
  }

  let results = null;
  for (const [key, value] of Object.entries(newGame)) {
    if (key === "status" && value === types.game.ENDED) {
      results = await pool.query(
        `UPDATE games SET ${key} = $1, ended_at = $2 WHERE id = $3 RETURNING *`,
        [value, new Date().toISOString(), gameId]
      );
    } else {
      results = await pool.query(
        `UPDATE games SET ${key} = $1 WHERE id = $2 RETURNING *`,
        [value, gameId]
      );
    }
  }

  if (results === null) {
    results = await getGameById(gameId);
  }

  if (results.rowCount !== 1) {
    throw new Error("Invalid Game ID");
  }

  return results.rows[0];
}

async function createGame(player1Id, player2Id) {
  const results = await pool.query(
    "INSERT INTO games (player_1_id, player_2_id, current_player) VALUES ($1, $2, $3) RETURNING *",
    [player1Id, player2Id, player1Id]
  );

  if (results.rowCount !== 1) {
    throw new Error("Game cannot be created");
  }

  return results.rows[0];
}

async function initializeDatabase() {
  await initDB(pool);
}

module.exports = {
  initializeDatabase,
  users: {
    getUserById,
    getActiveUsers,
    doesUserExist,
    createUser,
    updateUserName,
    updateUserStatus,
    deleteUser,
  },
  games: {
    getGamesByPlayerId,
    getGameById,
    createGame,
    updateGame,
  },
};
