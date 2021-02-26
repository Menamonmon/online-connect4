import React, { useState } from "react";
import Modal from "react-modal";
import { useSocket } from "../contexts/SocketConext";
import { useUsers } from "../contexts/UsersContext";

export default function InviteUserModal({ isOpen, setOpen }) {
  const { invitedUser, setInvitedUser } = useUsers();
  const { socket } = useSocket();
  const [invitationStatus, setInvitationStatus] = useState("Pending invitation");
  // 2 => pending
  // 1 => accepted
  // 0 => rejected


  return (
    <Modal
      isOpen={isOpen}
      onAfterOpen={() => {
        socket.emit("invite user", invitedUser);

        const inviteAcceptedHandler = () => {
          setTimeout(() => {
            setOpen(false);
          }, 10000)
          setInvitationStatus("Invitation Accepted");
          socket.off("invited user accepted invite", inviteAcceptedHandler);
          socket.off("invited user rejected invite", inviteRejectedHandler);
        };

        const inviteRejectedHandler = () => {
          setTimeout(() => {
            setOpen(false);
          }, 10000)
          setInvitedUser({});
          setInvitationStatus("Invitation Rejected");
          socket.off("invited user accepted invite", inviteAcceptedHandler);
          socket.off("invited user rejected invite", inviteRejectedHandler);
        };

        socket.on("invited user accepted invite", inviteAcceptedHandler);
        socket.on("invited user rejected invite", inviteRejectedHandler);
      }}
      style={{
        content: {
          width: "fit-content",
          height: "fit-content",
          margin: "auto",
        },
      }}
    >
      <h1>{invitationStatus}</h1>
      <div>
        <h3>Invited User Info:</h3>
        <div style={{ margin: "20px" }}>
          <strong>Username: {invitedUser.name}</strong>
          <br />
          <strong>Date Joined: {invitedUser.created_at}</strong>
        </div>
      </div>
      <img
        alt="loading animation gif"
        src="https://i.pinimg.com/originals/25/ef/28/25ef280441ad6d3a5ccf89960b4e95eb.gif"
      />
    </Modal>
  );
}
