import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./components/Routes";

import TypesProvider from "./contexts/TypesContext";
import UsersProvider from "./contexts/UsersContext";
import GamesProvider from "./contexts/GamesContext";
import SocketProvider from "./contexts/SocketConext";

import "./App.css";
import ReactNotification from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import Modal from "react-modal";
import Navbar from "./components/Navbar";
import { ChakraProvider } from "@chakra-ui/react";

function App() {
  const appElement = useRef(null);

  useEffect(() => {
    Modal.setAppElement(appElement.current);
  });

  return (
    <div className="App" ref={appElement}>
      <ChakraProvider>
        <TypesProvider>
          <UsersProvider>
            <GamesProvider>
              <SocketProvider>
                <ReactNotification />
                <Navbar />
                <Router>
                  <Routes />
                </Router>
              </SocketProvider>
            </GamesProvider>
          </UsersProvider>
        </TypesProvider>
      </ChakraProvider>
    </div>
  );
}

export default App;
