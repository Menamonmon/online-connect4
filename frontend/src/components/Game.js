import React from "react";
import { useGames } from "../contexts/GamesContext";
import "./Game.css";
import GameCell from "./GameCell";

export default function GameCanvas({
  playerColor,
  useWinner,
  useWarning,
  switchPlayers,
}) {
  let { currentGame: game, updateCurrentGame: updateGame } = useGames();
  let [winner, updateWinner] = useWinner();
  let [warning, setWarning] = useWarning();

  function calculateColumnIndicies(col) {
    const columnIndicies = [];
    for (let k = 0; k < 6; k++) {
      columnIndicies.push(col + k * 6);
    }
    columnIndicies.reverse();
    return columnIndicies;
  }

  function getAvailableIndex(col) {
    const columnIndicies = calculateColumnIndicies(col);

    let availableIndex = -1;
    for (let i of [...columnIndicies]) {
      if (game.state.charAt(i) !== "0") {
        columnIndicies.shift();
      } else {
        availableIndex = i;
        break;
      }
    }
    return availableIndex;
  }

  function isMoveWinning(gameState, playerColor) {
    const isIdentical = (arr) => arr.every((v) => v === arr[0]);
    const getDiagonalArrays = (arr) => {
      const result = [];
      const r = arr.length;
      const c = arr[0].length;
      const maxLength = Math.max(r, c);
      let temp;
      for (let i = 0; i <= (maxLength - 1) * 2; ++i) {
        temp = [];
        for (let y = r - 1; y >= 0; --y) {
          let x = i - y;
          if (x >= 0 && x < c) {
            temp.push(arr[y][x]);
          }
        }

        if (temp.length >= 4) {
          result.push(temp);
        }

        temp = [];
        for (let y = r - 1; y >= 0; --y) {
          let x = i - (r - y);
          if (x >= 0 && x < c) {
            temp.push(arr[y][x]);
          }
        }

        if (temp.length >= 4) {
          result.push(temp);
        }
      }

      return result;
    };

    const state = [];
    for (let i = 0; i < 6; i++) {
      let row = [];
      for (let j = 0; j < 6; j++) {
        row[j] = gameState.charAt(i * 6 + j);
      }
      state.push(row);
    }

    // Checking for horizontal and vertical
    for (let r = 0; r < 6; r++) {
      // Checking the horizontal rows
      for (let c = 0; c < 3; c++) {
        let currentRow = state[r].slice(c, c + 4);
        if (isIdentical(currentRow) && currentRow[0] !== "0") {
          return true;
        }
      }

      // Checking the vertical columns
      for (let c = 0; c < 3; c++) {
        let currentCol = [];
        for (let i = 0; i < 4; i++) {
          currentCol.push(state[i + c][r]);
        }
        if (isIdentical(currentCol) && currentCol[0] !== "0") {
          return true;
        }
      }
    }

    // Checking the diagonals
    for (let arr of getDiagonalArrays(state)) {
      let length = arr.length;
      let k = length - 4;
      for (let i = 0; i < k; i++) {
        let currentArr = arr.slice(i, i + 4);
        if (isIdentical(currentArr) && currentArr[0] !== "0") {
          return true;
        }
      }
    }

    return false;
  }

  function handleClick(e, col) {
    if (winner) {
      return;
    } else if (playerColor === null) {
      setWarning("This is not your turn");
      return;
    }

    col--;
    const newGameState = game.state.split("").map((a) => parseInt(a));
    const availableIndex = getAvailableIndex(col);

    if (availableIndex >= 0) {
      newGameState[availableIndex] = playerColor;
      const newGameStateStr = newGameState.join("");
      updateGame((p) => ({ ...p, state: newGameStateStr }));
      const msg = isMoveWinning(newGameStateStr)
        ? `${playerColor} is a winner`
        : "There is no winner yet";
      setWarning(msg);
      switchPlayers();
    } else {
      setWarning("Please choose another column");
    }
  }

  return (
    <div className="game-container">
      {game.state
        .split("")
        .map((a) => parseInt(a))
        .map((s, i) => (
          <GameCell
            state={s}
            index={i}
            onClick={handleClick}
            key={`game-cell${i}`}
          />
        ))}
    </div>
  );
}
