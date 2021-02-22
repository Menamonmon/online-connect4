import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./components/Routes";

import TypesProvider from "./contexts/TypesContext";
import UsersProvider from "./contexts/UsersContext";
import GamesProvider from "./contexts/GamesContext";
import SocketProvider from "./contexts/SocketConext";

import "./App.css";

function App() {
  return (
    <div className="App">
      <SocketProvider>
        <TypesProvider>
          <UsersProvider>
            <GamesProvider>
              <Router>
                <Routes />
              </Router>
            </GamesProvider>
          </UsersProvider>
        </TypesProvider>
      </SocketProvider>
    </div>
  );
}

export default App;
