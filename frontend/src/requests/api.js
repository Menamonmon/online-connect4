import axios from "axios";
import { baseURL } from "../consts";

const apiClient = axios.create({
  baseURL: baseURL,
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

const api = {
  signupUser,
  getGameListForUser,
  getActiveUsersList,
  createGame,
  getTypes,
};

export default api;
