const types = require("./types");

const DEFAULT_USER_STATUS = types.user.ACTIVE;
const DEFAULT_GAME_STATUS = types.game.AVAIL;

function generatePlaceholderString(length) {
  let final = "";
  for (let i = 0; i < length; i++) {
    final += i !== length - 1 ? `$${i + 1}, ` : `$${i + 1}`;
  }
  return final;
}

async function checkIfTypeExists(pool, typname) {
  const results = await pool.query(
    "SELECT typname FROM pg_type WHERE typname = $1",
    [typname]
  );
  return results.rowCount === 1;
}

async function createTables(pool) {
  // Creating the ENUM Types for representing the states for the game and the user
  const userStatusTypesArray = Object.values(types.user);
  const gameStatusTypesArray = Object.values(types.game);

  const enumTypesReducer = (final, current, i) => {
    if (i == 1) {
      return `'${final}'` + `, '${current}'`;
    }
    return final + `, '${current}'`;
  };

  if (!(await checkIfTypeExists(pool, "userstatus"))) {
    await pool.query(
      `CREATE TYPE userstatus AS ENUM(${userStatusTypesArray.reduce(
        enumTypesReducer
      )})`
    );
  }
  if (!(await checkIfTypeExists(pool, "gamestatus"))) {
    await pool.query(
      `CREATE TYPE gamestatus AS ENUM(${gameStatusTypesArray.reduce(
        enumTypesReducer
      )})`
    );
  }
  console.log("ENUM TYPES CREATED");
  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY NOT NULL,
      name VARCHAR(50) NOT NULL,
      status userstatus NOT NULL DEFAULT '${DEFAULT_USER_STATUS}',
      created_at TIMESTAMP DEFAULT NOW()
    )
    `
  );
  console.log("USER TABLE CREATED");
  const INITIAL_GAME_STATE = `${types.cell.EMPTY}`.repeat(36);
  await pool.query(
    `
    CREATE TABLE IF NOT EXISTS games (
      id SERIAL PRIMARY KEY NOT NULL,
      player_1_id INT NOT NULL ,
      player_2_id INT NOT NULL,
      state VARCHAR(36) NOT NULL DEFAULT '${INITIAL_GAME_STATE}',
      status gamestatus NOT NULL DEFAULT '${DEFAULT_GAME_STATUS}',
      created_at TIMESTAMP DEFAULT NOW(),
      ended_at TIMESTAMP,
      FOREIGN KEY (player_1_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
      FOREIGN KEY (player_2_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
      CONSTRAINT different_ids CHECK (player_1_id != player_2_id),
      CONSTRAINT check_state_length CHECK (length(state) = 36)
    )
    `
  );
  console.log("GAME TABLE CREATED");
}

module.exports = { createTables };
