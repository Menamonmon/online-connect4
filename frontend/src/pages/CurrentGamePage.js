import React, { useEffect, useState } from "react";
import GameCanvas from "../components/Game";
import GameCell from "../components/GameCell";
import { useGames } from "../contexts/GamesContext";
import { useUsers } from "../contexts/UsersContext";

const evaluateUsersColors = (currentUser, invitedUser, game) => {
  const colors = {
    currentUserColor: null,
    invitedUserColor: null,
  };

  if (game.player_1_id === currentUser.id) {
    colors.currentUserColor = game.player_1_color;
  } else if (game.player_1_id === invitedUser.id) {
    colors.invitedUserColor = game.player_1_color;
  }

  if (game.player_2_id === currentUser.id) {
    if (colors.currentUserColor) {
      throw Error(
        "The game does not have distinct user id's for user 1 and user 2"
      );
    }

    colors.currentUserColor = game.player_2_color;
  } else if (game.player_2_id === invitedUser.id) {
    if (colors.invitedUserColor) {
      throw Error(
        "The game does not have distinct user id's for user 1 and user 2"
      );
    }

    colors.invitedUserColor = game.player_2_color;
  }

  if (
    !colors.currentUserColor ||
    !colors.invitedUserColor ||
    colors.currentUserColor === colors.invitedUserColor
  ) {
    throw Error(
      `Problem with matching the user colors (${JSON.stringify(
        colors,
        null,
        2
      )})`
    );
  }
  return colors;
};

export default function CurrentGamePage() {
  const { currentUser, invitedUser } = useUsers();
  let { currentGame, setCurrentGame } = useGames();
  let [currentPlayer, setCurrentPlayer] = useState({});
  let [{ currentUserColor, invitedUserColor }, setUserColors] = useState({});

  useEffect(() => {
    const currentPlayer =
      currentGame.current_player === currentUser.id ? currentUser : invitedUser;

    setCurrentPlayer(currentPlayer);
    setUserColors(evaluateUsersColors(currentUser, invitedUser, currentGame));
  }, [currentGame]);

  const [winner, setWinner] = useState(null);
  const [warning, setWarning] = useState(
    currentUser === currentPlayer
      ? "This is your turn"
      : "This is your opponent's turn"
  );

  const infoStyle = { color: "green", margin: 0 };
  console.log("CURRENT PLAYER:", currentPlayer);
  console.log("CURRENT USER:", currentUser);

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
        useWinner={() => [winner, setWinner]}
        useWarning={() => [warning, setWarning]}
        playerColor={
          currentUser.id === currentPlayer.id ? currentUserColor : null
          // currentUserColor
        }
        switchPlayers={() => {
          // setCurrentGame((p) => ({ ...p, current_player: invitedUser.id }));
        }}
      />
    </div>
  );
}
