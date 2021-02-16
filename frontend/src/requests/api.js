import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

async function signupUser(userData) {
  return await apiClient.post("/users/signup", userData);
}

async function getGameListForUser(userId) {
  return await apiClient.get(`/games/user/${userId}`);
}

async function getActiveUsersList(userId) {
  return await apiClient.get(`/users/active/${userId}`);
}

async function createGame(player1Id, player2Id) {
  return await apiClient.post("games/create", { player1Id, player2Id });
}

async function getTypes() {
  return await apiClient.get("types");
}

const api = {
  signupUser,
  getGameListForUser,
  getActiveUsersList,
  createGame,
};

export default api;
