import React, { createContext, useContext, useEffect, useState } from "react";
import { store } from "react-notifications-component";
import { io } from "socket.io-client";
import {
  addInviteNotification,
  removeNotification,
} from "../components/InvitationNotification";
import { baseURL } from "../consts";
import { useGames } from "./GamesContext";
import { useUsers } from "./UsersContext";

const socket = io(baseURL, { autoConnect: false });

const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const { setActiveUsers, setCurrentUser, setInvitedUser } = useUsers();
  const { setCurrentGame } = useGames();
  const [notificationID, setNotificationID] = useState(null);

  useEffect(() => {
    socket.on("auu", (users) => {
      setActiveUsers(users);
    });

    socket.on("notify of invite", (invitingUser) => {
      setNotificationID(addInviteNotification(invitingUser));
    });

    socket.on(
      "game created",
      ({ game, currentUser: newCurrentUser, invitedUser: newInvitedUser }) => {
        setCurrentGame(game);
        setCurrentUser(newCurrentUser);
        setInvitedUser(newInvitedUser);
      }
    );

    socket.on("game has changed", (newGame) => {
      setCurrentGame(newGame);
    });

    socket.on("game has ended", () => {
      const gameEndNotification = {
        title: "Game Ended",
        message:
          "The game was ended because the other player either left the game or logged out of his account",
        type: "warning",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      };
      store.addNotification(gameEndNotification);
      setCurrentGame({});
      setInvitedUser({});
    });

    socket.on("clear game", () => {
      setCurrentGame({});
      setInvitedUser({});
    });

    socket.on("error with saving game", (message) => {
      const endgameErrorNotification = {
        title: "Error With Saving Game",
        message,
        type: "danger",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      };
      store.addNotification(endgameErrorNotification);
    });

    socket.on("disconnect", () => {
      setCurrentGame({});
      setInvitedUser({});
      setCurrentUser({});
      setActiveUsers([]);
    });
  }, [
    setActiveUsers,
    setCurrentUser,
    setInvitedUser,
    setCurrentGame,
    setNotificationID,
  ]);

  useEffect(() => {
    socket.off("invite canceled");
    socket.on("invite canceled", () => {
      socket.emit("invite rejected");
      removeNotification(notificationID);
    });
  }, [notificationID]);

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
