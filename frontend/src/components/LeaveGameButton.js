import React from "react";
import { useSocket } from "../contexts/SocketConext";

export default function LeaveGameButton() {
  const { socket } = useSocket();

  return <button onClick={() => socket.emit("end game")}>Leave Game</button>;
}
