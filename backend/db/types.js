const coinStateTypes = {
  EMPTY: 0,
  RED: 1,
  YELLOW: 2,
};

const userStateTypes = {
  ACTIVE: "USERACTIVE",
  INACTIVE: "USERINACTIVE",
};

const gameStateTypes = {
  AVAIL: "GAMEAVAIL",
  UNAVAIL: "GAMEUNAVAIL",
  ENDED: "GAMEENDED"
}
module.exports = {
  coinStateTypes,
  userStateTypes,
  gameStateTypes,
};
