import React from "react";
import { useGames } from "../contexts/GamesContext";
import { useSocket } from "../contexts/SocketConext";
import { useUsers } from "../contexts/UsersContext";
import { useTypes } from "../contexts/TypesContext";

import GameCell from "./GameCell";
import { Box } from "@chakra-ui/layout";

export default function Game({ playerColor, useWarning }) {
  const { currentGame, setCurrentGame } = useGames();
  const { currentUser, invitedUser } = useUsers();
  const {
    cell: { EMPTY },
  } = useTypes();
  const EMPTYCELL = EMPTY.toString();
  const { socket } = useSocket();
  const [_, setWarning] = useWarning();

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
      if (currentGame.state.charAt(i) !== EMPTYCELL) {
        columnIndicies.shift();
      } else {
        availableIndex = i;
        break;
      }
    }
    return availableIndex;
  }

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

  function isMoveWinning(gameState) {
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
        if (isIdentical(currentRow) && currentRow[0] !== EMPTYCELL) {
          return true;
        }
      }

      // Checking the vertical columns
      for (let c = 0; c < 3; c++) {
        let currentCol = [];
        for (let i = 0; i < 4; i++) {
          currentCol.push(state[i + c][r]);
        }
        if (isIdentical(currentCol) && currentCol[0] !== EMPTYCELL) {
          return true;
        }
      }
    }

    // Checking the diagonals
    const diagonals = getDiagonalArrays(state);
    for (let arr of diagonals) {
      if (arr.length === 4) {
        if (isIdentical(arr) && arr[0] !== EMPTYCELL) {
          return true;
        }
        continue;
      }
      let length = arr.length;
      let k = length - 4;
      for (let i = 0; i < k; i++) {
        let currentArr = arr.slice(i, i + 4);
        if (isIdentical(currentArr) && currentArr[0] !== EMPTYCELL) {
          return true;
        }
      }
    }

    return false;
  }

  function handleClick(_, col) {
    if (currentGame.winner) {
      setWarning("There is already a winner!");
      return;
    } else if (playerColor === null) {
      return;
    }

    col--;
    const newGameState = currentGame.state.split("").map((a) => parseInt(a));
    const availableIndex = getAvailableIndex(col);

    if (availableIndex >= 0) {
      newGameState[availableIndex] = playerColor;
      const newGameStateStr = newGameState.join("");
      const isThisAWin = isMoveWinning(newGameStateStr);
      setCurrentGame((p) => {
        const newGame = {
          ...p,
          state: newGameStateStr,
          current_player: invitedUser.id,
        };
        if (isThisAWin) {
          newGame.winner = currentUser.id;
        }
        socket.emit("update game", newGame);
        return newGame;
      });
    } else {
      setWarning("Please choose another column");
    }
  }

  return (
    <Box
      bgColor="blue.500"
      minH="500px"
      minW="500px"
      display="grid"
      gridTemplateColumns="repeat(6, 1fr)"
      gridTemplateRows="repeat(6, 1fr)"
      gridGap="10px"
      p="10px"
      borderRadius="15px"
    >
      {currentGame.state
        .split("")
        .map((a) => parseInt(a))
        .map((s, i) => (
          <GameCell
            state={s}
            index={i}
            onClick={handleClick}
            key={`game-cell-${i}`}
          />
        ))}
    </Box>
  );
}
