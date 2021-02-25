import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./components/Routes";

import TypesProvider from "./contexts/TypesContext";
import UsersProvider from "./contexts/UsersContext";
import GamesProvider from "./contexts/GamesContext";
import SocketProvider from "./contexts/SocketConext";

import "./App.css";
import LogoutButton from "./components/LogoutButton";

function App() {
  return (
    <div className="App">
      <TypesProvider>
        <UsersProvider>
          <GamesProvider>
            <SocketProvider>
              <LogoutButton />
              <Router>
                <Routes />
              </Router>
            </SocketProvider>
          </GamesProvider>
        </UsersProvider>
      </TypesProvider>
    </div>
  );
}

export default App;
