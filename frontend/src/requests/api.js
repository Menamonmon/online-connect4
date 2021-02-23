import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000",
  timeout: 10000,
});

async function signupUser(userData) {
  const res = await apiClient.post("/users/signup", userData);
  const data = await res.data;
  return data;
}

async function getGameListForUser(userId) {
  return await apiClient.get(`/games/user/${userId}`);
}

async function getActiveUsersList(userId) {
  return await apiClient.get(`/users/active/${userId}`);
}

async function createGame(player1Id, player2Id) {
  return await apiClient.post("/games/create", { player1Id, player2Id });
}

async function getTypes() {
  return await apiClient.get("/types");
}

async function getSocketEvents() {
  const res = await apiClient.get("/socket-events");
  const events = await res.data;
  return events;
}

const api = {
  signupUser,
  getGameListForUser,
  getActiveUsersList,
  createGame,
  getTypes,
  getSocketEvents,
};

export default api;
