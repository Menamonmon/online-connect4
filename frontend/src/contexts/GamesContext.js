import React, { createContext, useContext, useState } from "react";

const initialGamesValue = {
  currentGame: {},
  prevGames: [],
};

const GamesContext = createContext(initialGamesValue);

export default function GamesProvider({ children }) {
  const [currentGame, setCurrentGame] = useState(initialGamesValue.currentGame);
  const [prevGames, setPrevGames] = useState(initialGamesValue.prevGames);

  return (
    <GamesContext.Provider
      value={{
        currentGame,
        setCurrentGame,
        prevGames,
        setPrevGames,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
}

export function useGames() {
  return useContext(GamesContext);
}
