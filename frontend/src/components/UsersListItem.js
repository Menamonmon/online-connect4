import { Button } from "@chakra-ui/button";
import { Circle, Heading, HStack, ListItem } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import React from "react";

import { useTypes } from "../contexts/TypesContext";

const matchUserStatus = (status, types) => {
  const keys = Object.keys(types);
  const values = Object.values(types);

  const valIndex = values.indexOf(status);
  if (!(valIndex >= 0)) {
    return "";
  }

  return keys[valIndex].toLowerCase();
};

function isActive(userStatusString) {
  return userStatusString === "active";
}

function formatDate(createdAt) {
  return `${createdAt.getMonth()}/${createdAt.getDate()}/${createdAt.getFullYear()}`;
}

export default function UserListItem({
  user: { name, status, created_at },
  onInvite,
}) {
  const { user: userTypes } = useTypes();
  const createdAt = new Date(created_at);
  const isUserActive = isActive(matchUserStatus(status, userTypes));
  return (
    <ListItem
      as={HStack}
      borderRadius="15px"
      bgColor="blue.200"
      p={5}
      my={5}
      w="100%"
      justifyContent="space-between"
    >
      <Heading size="md">{name}</Heading>
      <Tooltip label={isUserActive ? "User is Active" : "User Not Active"}>
        <Circle size="10px" bg={isUserActive ? "green" : "red"} />
      </Tooltip>
      <Heading size="sm">Active Since: {formatDate(createdAt)}</Heading>
      <Button onClick={onInvite} colorScheme="green">
        Invite To A Game
      </Button>
    </ListItem>
  );
}
