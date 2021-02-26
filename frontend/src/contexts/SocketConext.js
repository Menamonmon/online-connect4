import React, { createContext, useContext, useEffect } from "react";
import { io } from "socket.io-client";
import { useNotification } from "./NotificaitonsContext";
import { useUsers } from "./UsersContext";

const URL = "http://localhost:5000";
const socket = io(URL, { autoConnect: false });

const SocketContext = createContext();

const InviteActionButtonsStyles = {
  background: "#5ea400",
  color: "white",
  border: "none",
  margin: "10px",
  fontSize: "1.2rem",
};

export default function SocketProvider({ children }) {
  const { setActiveUsers, setCurrentUser } = useUsers();
  const notificationRef = useNotification();

  useEffect(() => {
    socket.on("auu", (users) => {
      setActiveUsers(users);
    });

    socket.on("notify of invite", (invitingUser) => {
      notificationRef.current.addNotification({
        message: `A new invite has been sent from ${invitingUser.name}`,
        level: "success",
        autoDismiss: 0,
        dismissible: "none",
        children: (
          <div
            style={{
              margin: "10px",
            }}
          >
            <button
              onClick={() => {
                socket.emit("invite accepted");
                notificationRef.current.clearNotifications();
              }}
              style={{ ...InviteActionButtonsStyles, background: "#5ea400" }}
            >
              Accept
            </button>
            <button
              onClick={() => {
                socket.emit("invite rejected");
                notificationRef.current.clearNotifications();
              }}
              style={{
                ...InviteActionButtonsStyles,
                background: "#ec3d3d",
              }}
            >
              Reject
            </button>
          </div>
        ),
      });
    });
  }, [setActiveUsers, setCurrentUser, notificationRef]);

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
