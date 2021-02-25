import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useUsers } from "./UsersContext";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });

const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const { currentUser, setActiveUsers, setCurrentUser } = useUsers();

  useEffect(() => {
    socket.on("auu", (users) => {
      console.log(users);
      setActiveUsers(users);
    });
  }, [setActiveUsers, setCurrentUser]);

  return (
    <SocketContext.Provider
      value={{
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
