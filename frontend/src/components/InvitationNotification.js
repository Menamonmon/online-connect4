import React from "react";
import { useSocket } from "../contexts/SocketConext";
import { store as notifications } from "react-notifications-component";
import { Box } from "@chakra-ui/layout";
import { Button, ButtonGroup } from "@chakra-ui/button";

export default function InvitationNotification({ id }) {
  const { socket } = useSocket();

  return (
    <Box>
      <ButtonGroup>
        <Button
          colorScheme="green"
          onClick={() => {
            socket.emit("invite accepted");
            removeNotification(id);
          }}
        >
          Accept
        </Button>
        <Button
          colorScheme="red"
          onClick={() => {
            socket.emit("invite rejected");
            removeNotification(id);
          }}
        >
          Reject
        </Button>
      </ButtonGroup>
    </Box>
  );
}

export function addInviteNotification(invitingUser) {
  const notificationID = `notification-for:${invitingUser.name}-(${
    invitingUser.id
  })-(${Math.random() * 1000})`;
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
