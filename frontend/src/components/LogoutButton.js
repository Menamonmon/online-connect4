import React from "react";
import { useSocket } from "../contexts/SocketConext";
import { useUsers } from "../contexts/UsersContext";

export default function LogoutButton() {
  const { socket } = useSocket();
  const { setCurrentUser } = useUsers();

  return (
    <button
      onClick={() => {
        setCurrentUser({});
        socket.disconnect();
      }}
      className="logout-btn"
    >
      Logout
    </button>
  );
}
