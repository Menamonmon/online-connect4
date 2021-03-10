import React from "react";
import { useGames } from "../contexts/GamesContext";
import { useSocket } from "../contexts/SocketConext";

export default function LeaveGameButton() {
  const { socket } = useSocket();
  const { currentGame } = useGames();

  return (
    <button onClick={() => socket.emit("end game", currentGame)}>
      Leave Game
    </button>
  );
}
