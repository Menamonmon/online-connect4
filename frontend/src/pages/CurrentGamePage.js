import React, { useState } from "react";
import GameCanvas from "../components/Game";
import GameCell from "../components/GameCell";
import { useGames } from "../contexts/GamesContext";
import { useUsers } from "../contexts/UsersContext";

export default function CurrentGamePage() {
  const { currentUser, invitedUser } = useUsers();
  let { currentGame: game, updateGame } = useGames();

  const currentUserColor =
    game.player_1_id === currentUser.id
      ? game.player_1_color
      : game.player_2_color;
  const invitedUserColor =
    game.player_1_id === invitedUser.id
      ? game.player_1_color
      : game.player_2_color;
  const currentPlayer =
    game.current_player === currentUser.id ? currentUser : invitedUser;

  const [winner, setWinner] = useState(null);
  const [warning, setWarning] = useState(
    currentUser === currentPlayer
      ? "This is your turn"
      : "This is your opponent's turn"
  );
  const infoStyle = { color: "green", margin: 0 };

  return (
    <div className="game-page-container">
      <div
        className="game-page-header"
        style={{
          textAlign: "left",
          width: "calc(70vw + 20px)",
          margin: "20px auto",
          padding: "0px",
          maxWidth: "90vh",
        }}
      >
        <div
          className="game-page-title"
          style={{
            backgroundColor: "lightgrey",
            padding: "10px",
          }}
        >
          <h3 style={infoStyle}>
            You: {currentUser.name}
            <div style={{ float: "right" }}>
              <GameCell state={currentUserColor} custom width="5vh" />
            </div>
          </h3>
          <br />
          <h3 style={{ ...infoStyle, color: "red" }}>
            Opponent: {invitedUser.name}
            <div style={{ float: "right" }}>
              <GameCell state={invitedUserColor} custom width="5vh" />
            </div>
          </h3>
        </div>
        <div
          className="stats-section"
          style={{ backgroundColor: "lightgrey", padding: 10 }}
        >
          <h3 style={{ ...infoStyle, color: "blue" }}>Stats:</h3>
          <h5 style={{ margin: 0 }}>Current Player: {currentPlayer.name}</h5>
          <h5 style={{ margin: 0 }}>
            {winner ? "There is a winner" : "No Winner Yet"}
          </h5>
          <h5 style={{ margin: 0 }}>{warning}</h5>
        </div>
      </div>
      <GameCanvas
        game={game}
        updateGame={updateGame}
        useWinner={() => [winner, setWinner]}
        useWarning={() => [warning, setWarning]}
        playerColor={currentUser === currentPlayer ? currentUserColor : null}
        switchPlayers={() => {
          // updateGame((p) => ({ ...p, current_player: invitedUser.id }));
        }}
      />
    </div>
  );
}
