import React from "react";
import { useSocket } from "../contexts/SocketConext";
import { store as notifications } from "react-notifications-component";

export default function InvitationNotification({ id }) {
  const { socket } = useSocket();

  const InviteActionButtonsStyles = {
    background: "#5ea400",
    color: "white",
    border: "none",
    margin: "10px",
    fontSize: "1.2rem",
  };

  return (
    <div
      style={{
        margin: "10px",
      }}
    >
      <button
        onClick={() => {
          socket.emit("invite accepted");
          removeNotification(id);
        }}
        style={{ ...InviteActionButtonsStyles, background: "#5ea400" }}
      >
        Accept
      </button>
      <button
        onClick={() => {
          socket.emit("invite rejected");
          removeNotification(id);
        }}
        style={{
          ...InviteActionButtonsStyles,
          background: "#ec3d3d",
        }}
      >
        Reject
      </button>
    </div>
  );
}

export function addInviteNotification(invitingUser) {
  const notificationID = `notification-for:${invitingUser.name}-(${invitingUser.id})-(${Math.random() * 1000})`;
  removeNotification(notificationID);
  const notification = {
    id: notificationID,
    title: `A new invite has been sent from ${invitingUser.name}`,
    container: "top-right",
    type: "info",
    dismiss: {
      duration: 0,
      click: false,
      touch: false,
      showIcon: false,
      pauseOnHover: true,
    },
    message: <InvitationNotification id={notificationID} />,
  };
  return notifications.addNotification(notification);
}

export function removeNotification(id) {
  notifications.removeNotification(id);
}
