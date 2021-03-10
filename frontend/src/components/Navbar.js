import React from "react";

import { useUsers } from "../contexts/UsersContext";
import { useGames } from "../contexts/GamesContext";

import LeaveGameButton from "./LeaveGameButton";
import LogoutButton from "./LogoutButton";

import { isObjectEmpty } from "../utils/utils";

import "./Navbar.css";

export default function Navbar() {
  const { currentUser } = useUsers();
  const { currentGame } = useGames();

  const isAuthenticated = !isObjectEmpty(currentUser);
  const gameExists = !isObjectEmpty(currentGame);
  return (
    <nav>
      <ul className="nav-items">
        {isAuthenticated ? (
          <li key="logout" className="nav-item">
            <LogoutButton />
          </li>
        ) : (
          <></>
        )}
        {gameExists ? (
          <li key="leave-game" className="nav-item">
            <LeaveGameButton />
          </li>
        ) : (
          <></>
        )}
      </ul>
    </nav>
  );
}
