import React, { useEffect, useRef } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "./components/Routes";

import TypesProvider from "./contexts/TypesContext";
import UsersProvider from "./contexts/UsersContext";
import GamesProvider from "./contexts/GamesContext";
import SocketProvider from "./contexts/SocketConext";
import NotificationProvider from "./contexts/NotificaitonsContext";

import "./App.css";
import LogoutButton from "./components/LogoutButton";
import NotificationSystem from "react-notification-system";
import Modal from "react-modal";
import Navbar from "./components/Navbar";

function App() {
  const notificationRef = useRef(null);
  const appElement = useRef(null);

  useEffect(() => {
    Modal.setAppElement(appElement.current);
  });

  return (
    <div className="App" ref={appElement}>
      <NotificationProvider value={notificationRef}>
        <TypesProvider>
          <UsersProvider>
            <GamesProvider>
              <SocketProvider>
                <Navbar />
                <Router>
                  <Routes />
                </Router>
                <NotificationSystem ref={notificationRef} />
              </SocketProvider>
            </GamesProvider>
          </UsersProvider>
        </TypesProvider>
      </NotificationProvider>
    </div>
  );
}

export default App;
