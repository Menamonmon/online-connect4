import React, { createContext, useContext, useState } from "react";

const initialGamesValue = {
  currentGame: {},
  prevGames: [],
};

const GamesContext = createContext(initialGamesValue);

export default function GamesProvider({ children, value: inheritedValue }) {
  const [currentGame, setCurrentGame] = useState(
    inheritedValue.currentGame || initialGamesValue.currentGame
  );
  const [prevGames, setPrevGames] = useState(
    inheritedValue.prevGames || initialGamesValue.prevGames
  );

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
