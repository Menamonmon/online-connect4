import React, { useEffect, useState } from "react";
import GameCanvas from "../components/Game";
import GameCell from "../components/GameCell";
import { useGames } from "../contexts/GamesContext";
import { useUsers } from "../contexts/UsersContext";
import { isObjectEmpty, evaluateUsersColors } from "../utils/utils";

export default function CurrentGamePage() {
  const { currentUser, invitedUser } = useUsers();
  const { currentGame } = useGames();
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [{ currentUserColor, invitedUserColor }, setUserColors] = useState({});
  const [warning, setWarning] = useState(
    currentUser.id === currentPlayer.id
      ? "This is your turn"
      : "This is your opponent's turn"
  );

  const infoStyle = { color: "green", margin: 0 };

  useEffect(() => {
    if (
      isObjectEmpty(currentGame) ||
      isObjectEmpty(currentUser) ||
      isObjectEmpty(invitedUser)
    ) {
      return;
    }
    const currentPlayer =
      currentGame.current_player === currentUser.id ? currentUser : invitedUser;

    setCurrentPlayer(currentPlayer);
    setUserColors(evaluateUsersColors(currentUser, invitedUser, currentGame));
  }, [currentGame, currentUser, invitedUser]);

  return isObjectEmpty(currentGame) ? (
    <h1>Ending the game because one of the plyers left</h1>
  ) : (
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
            {currentGame.winner
              ? `There is a winner (${
                  currentGame.winner === currentUser.id
                    ? currentUser.name
                    : invitedUser.name
                })`
              : "No Winner Yet"}
          </h5>
          <h5 style={{ margin: 0 }}>{warning}</h5>
        </div>
      </div>
      <GameCanvas
        useWarning={() => [warning, setWarning]}
        playerColor={
          currentPlayer.id === currentUser.id ? currentUserColor : null
        }
      />
    </div>
  );
}
