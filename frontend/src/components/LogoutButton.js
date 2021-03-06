import React from "react";
import { useSocket } from "../contexts/SocketConext";
import { store } from "react-notifications-component";
import { Button } from "@chakra-ui/button";

export default function LogoutButton() {
  const { socket } = useSocket();

  function logout() {
    socket.disconnect();
    const logoutNotification = {
      title: "Logout",
      message: "You have been logged out successfully.",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__fadeIn"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 1000,
        onScreen: true,
      },
    };
    store.addNotification(logoutNotification);
  }

  return (
    <Button size="sm" onClick={logout} colorScheme="red">
      Logout
    </Button>
  );
}
