import React, { createContext, useContext, useState } from "react";

const initialGamesValue = {
  currentGame: {},
  updateCurrentGame: () => {},
  prevGames: [],
  updatePrevGames: () => {},
};

const GamesContext = createContext(initialGamesValue);

export default function GamesProvider({ children }) {
  const [currentGame, setCurrentGame] = useState(initialGamesValue.currentGame);
  const [prevGames, setPrevGames] = useState(initialGamesValue.prevGames);

  const updateCurrentGame = (newGame) => {
    setCurrentGame((p) => {
      localStorage.setItem("currentGame", JSON.stringify(newGame));
      return newGame;
    });
  };

  const updatePrevGames = (newGamesList) => {
    setPrevGames((p) => {
      localStorage.setItem("prevGames", JSON.stringify(newGamesList));
      return newGamesList;
    });
  };

  const value = {
    currentGame,
    updateCurrentGame,
    prevGames,
    updatePrevGames,
  };
  return (
    <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
  );
}

export function useGames() {
  return useContext(GamesContext);
}
