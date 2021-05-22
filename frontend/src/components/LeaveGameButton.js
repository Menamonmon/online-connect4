import { Button } from "@chakra-ui/button";
import React from "react";
import { useGames } from "../contexts/GamesContext";
import { useSocket } from "../contexts/SocketConext";

export default function LeaveGameButton() {
  const { socket } = useSocket();
  const { currentGame } = useGames();

  return (
    <Button
      size="sm"
      onClick={() => socket.emit("end game", currentGame)}
      colorScheme="yellow"
    >
      Leave Game
    </Button>
  );
}
