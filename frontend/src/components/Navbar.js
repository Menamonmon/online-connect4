import React from "react";
import { useUsers } from "../contexts/UsersContext";
import LogoutButton from "./LogoutButton";
import { isObjectEmpty } from "../utils/utils";
import "./Navbar.css";

export default function Navbar() {
  const { currentUser } = useUsers();

  const isAuthenticated = !isObjectEmpty(currentUser);
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
      </ul>
    </nav>
  );
}
