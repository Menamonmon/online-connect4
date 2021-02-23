import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../requests/api";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });

const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const [socketEvents, setSocketEvents] = useState({});
  useEffect(() => {
    async function fetchSocketEventsData() {
      const socketEventsData = await api.getSocketEvents();
      setSocketEvents(socketEventsData);
    }

    fetchSocketEventsData();
  }, []);
  return (
    <SocketContext.Provider
      value={{
        socket,
        socketEvents,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
