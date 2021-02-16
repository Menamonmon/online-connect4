import React, { useState } from "react";
import "./App.css";
import Routes from "./components/Routes";
import TypesProvider from "./contexts/TypesContext";
import UsersList from "./components/UsersList";
import SignupPage from "./pages/SignupPage";
import api from "./requests/api";
import { BrowserRouter as Router } from "react-router-dom";
import GameCanvas from "./components/Game";
import CurrentGamePage from "./pages/CurrentGamePage";

function App() {
  let [user, setUser] = useState({});
  let [invitedUser, setInvitedUser] = useState({});
  let [activeUsers, setActiveUsers] = useState([]);
  let [currentGame, setCurrentGame] = useState({});
  let [prevGamesList, setPrevGamesList] = useState([]);

  async function updateUser(newUser) {
    setUser(newUser);
    const response = await api.getActiveUsersList(newUser.id);
    const usersList = await response.data;
    setActiveUsers(usersList);
  }

  async function updateInvitedUser(newInvitedUser) {
    setInvitedUser(newInvitedUser);
  }
  /*

  user,
  activeUsers,
  updateUser,
  currentGame,
  updateGame,
  invitedUser,
  updateInvitedUser,
*/

  const [game, setGame] = useState({
    state: "000000000000000000000000000000000000",
    status: "GAMENOTAVAILABLE",
    id: 2312,
    created_at: "2021-02-10 17:43:24.397221",
    player_1_id: 203,
    player_2_id: 2,
    ended_at: null,
    player_1_color: "1",
    player_2_color: "2",
    winner: null,
    current_player: 203,
  });

  const user1 = {
    name: "Mena",
    id: 203,
    status: "USERUNAVAILABLE",
    created_at: "2021-02-2 17:43:24.397221",
  };

  const user2 = {
    name: "Masio",
    id: 2,
    status: "USERUNAVAILABLE",
    created_at: "2021-02-3 17:43:24.397221",
  };

  return (
    <div className="App">
      <TypesProvider>
        <CurrentGamePage
          currentUser={user1}
          invitedUser={user2}
          game={game}
          updateGame={setGame}
        />
        <Router>
          <Routes
            user={user}
            activeUsers={activeUsers}
            updateUser={updateUser}
            currentGame={currentGame}
            updateGame={setCurrentGame}
            invitedUser={invitedUser}
            updateInvitedUser={updateInvitedUser}
          />
        </Router>
      </TypesProvider>
    </div>
  );
}

export default App;
