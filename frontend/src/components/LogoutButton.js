import React from "react";
import { useSocket } from "../contexts/SocketConext";

export default function LogoutButton() {
  const { socket } = useSocket();
  return (
    <button onClick={() => socket.emit("logout")} className="logout-btn">
      Logout
    </button>
  );
}
