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

const enumTypesReducer = (final, current, i) => {
  if (i == 1) {
    return `'${final}'` + `, '${current}'`;
  }
  return final + `, '${current}'`;
};

async function createEnumType(pool, typename, typeValuesArray) {
  if (!(await checkIfTypeExists(pool, typename))) {
    await pool.query(
      `CREATE TYPE ${typename} AS ENUM(${typeValuesArray.reduce(
        enumTypesReducer
      )})`
    );
  }
}

async function createEnumTypes(pool) {
  // Creating the ENUM Types for representing the states for the game and the user
  await createEnumType(pool, "userstatus", Object.values(types.user));
  await createEnumType(pool, "gamestatus", Object.values(types.game));
  await createEnumType(pool, "cellstatus", Object.values(types.cell));

  console.log("ENUM TYPES CREATED");
}

async function createTables(pool) {
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
      player_1_id INT NOT NULL,
      player_2_id INT NOT NULL,
      state VARCHAR(36) NOT NULL DEFAULT '${INITIAL_GAME_STATE}',
      status gamestatus NOT NULL DEFAULT '${DEFAULT_GAME_STATUS}',
      created_at TIMESTAMP DEFAULT NOW(),
      ended_at TIMESTAMP,
      current_player INT NOT NULL,
      player_1_color cellstatus NOT NULL DEFAULT '${types.cell.RED}',
      player_2_color cellstatus NOT NULL DEFAULT '${types.cell.YELLOW}' ,
      winner INT,
      FOREIGN KEY (player_1_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
      FOREIGN KEY (player_2_id)
        REFERENCES users(id)
        ON DELETE SET NULL,
      FOREIGN KEY (current_player)
        REFERENCES users(id)
        ON DELETE SET NULL,
      FOREIGN KEY (winner)
        REFERENCES users(id)
        ON DELETE SET NULL,
      CONSTRAINT different_ids CHECK (player_1_id != player_2_id),
      CONSTRAINT check_state_length CHECK (length(state) = 36),
      CONSTRAINT check_current_player CHECK (current_player = player_1_id OR current_player = player_2_id),
      CONSTRAINT check_players_colors CHECK (player_1_color != player_2_color)
    )
    `
  );
  console.log("GAME TABLE CREATED");
}

async function initDB(pool) {
  await createEnumTypes(pool);
  await createTables(pool);
}

module.exports = { initDB };
