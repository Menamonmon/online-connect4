import { Box, Heading, Text } from "@chakra-ui/layout";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { CircularProgress } from "@chakra-ui/progress";
import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketConext";
import { useUsers } from "../contexts/UsersContext";
import { formatDate } from "../utils/utils";

const invitationStatusValues = {
  PENDING: "Pending Invitation Acceptance",
  ACCEPTED: "Invitation Accepted",
  REJECTED: "Invitation Rejected",
};

export default function InviteUserModal({ isOpen, setOpen }) {
  const { invitedUser, setInvitedUser } = useUsers();
  const { socket } = useSocket();
  const [invitationStatus, setInvitationStatus] = useState(
    invitationStatusValues.PENDING
  );

  const onOpen = useCallback(() => {
    socket.emit("invite user", invitedUser);

    const inviteAcceptedHandler = () => {
      setTimeout(() => {
        setOpen(false);
        setInvitationStatus(invitationStatusValues.ACCEPTED);
        socket.off("invited user accepted invite", inviteAcceptedHandler);
        socket.off("invited user rejected invite", inviteRejectedHandler);
      }, 3000);
    };

    const inviteRejectedHandler = () => {
      setTimeout(() => {
        setOpen(false);
        setInvitedUser({});
        setInvitationStatus(invitationStatusValues.REJECTED);
        socket.off("invited user accepted invite", inviteAcceptedHandler);
        socket.off("invited user rejected invite", inviteRejectedHandler);
      }, 3000);
    };

    socket.on("invited user accepted invite", inviteAcceptedHandler);
    socket.on("invited user rejected invite", inviteRejectedHandler);
  }, [socket, invitedUser, setInvitedUser, setOpen]);

  const onClose = () => {
    setInvitationStatus(invitationStatusValues.PENDING);
  };

  useEffect(() => {
    if (isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  const { name, created_at } = invitedUser;
  return (
    <Modal
      closeOnOverlayClick={false}
      closeOnEsc={false}
      isOpen={isOpen}
      isCentered
      onClose={onClose}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{invitationStatus}</ModalHeader>
        <ModalBody pb={6}>
          <Heading size="sm">Invited User Info:</Heading>
          <Box ml={5}>
            <Text>Name: {name}</Text>
            <Text>Date Joined: {formatDate(new Date(created_at))}</Text>
          </Box>
          <Box display="flex" mt={5}>
            <CircularProgress
              mx="auto"
              isIndeterminate
              size="100%"
              color="green"
            />
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
