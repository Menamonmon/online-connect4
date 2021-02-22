import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./components/Routes";

import TypesProvider from "./contexts/TypesContext";
import UsersProvider from "./contexts/UsersContext";
import GamesProvider from "./contexts/GamesContext";

import "./App.css";

function App() {
  return (
    <div className="App">
      <TypesProvider>
        <UsersProvider>
          <GamesProvider>
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
