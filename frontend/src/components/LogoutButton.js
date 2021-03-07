import React from "react";
import { useSocket } from "../contexts/SocketConext";

export default function LogoutButton() {
  const { socket } = useSocket();

  return (
    <button
      onClick={() => {
        socket.disconnect();
      }}
      className="logout-btn"
    >
      Logout
    </button>
  );
}
