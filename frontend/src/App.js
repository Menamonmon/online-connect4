import React, { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./components/Routes";

import TypesProvider from "./contexts/TypesContext";
import UsersProvider from "./contexts/UsersContext";
import GamesProvider from "./contexts/GamesContext";

import "./App.css";

function App() {
  const [game, setGame] = useState({
    state: "000000000000000000000000000000000000",
    status: "GAMENOTAVAILABLE",
    id: 2312,
    created_at: "2021-02-10 17:43:24.397221",
    player_1_id: 203,
    player_2_id: 2,
    ended_at: null,
    player_1_color: "2",
    player_2_color: "1",
    winner: null,
    current_player: 203,
  });

  const currentUser = {
    name: "Mena",
    id: 203,
    status: "USERUNAVAILABLE",
    created_at: "2021-02-2 17:43:24.397221",
  };

  const invitedUser = {
    name: "Masio",
    id: 2,
    status: "USERUNAVAILABLE",
    created_at: "2021-02-3 17:43:24.397221",
  };

  return (
    <div className="App">
      <TypesProvider>
        <UsersProvider value={{ currentUser, invitedUser }}>
          <GamesProvider value={{ currentGame: game }}>
            <Router>
              <Routes />
            </Router>
          </GamesProvider>
        </UsersProvider>
      </TypesProvider>
    </div>
  );
}

export default App;
