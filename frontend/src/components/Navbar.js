import React from "react";

import { Heading, ListItem, Text } from "@chakra-ui/layout";
import { List } from "@chakra-ui/react";

import { useUsers } from "../contexts/UsersContext";
import { useGames } from "../contexts/GamesContext";

import LeaveGameButton from "./LeaveGameButton";
import LogoutButton from "./LogoutButton";

import { isObjectEmpty } from "../utils/utils";

export default function Navbar() {
  const { currentUser } = useUsers();
  const { currentGame } = useGames();

  const isAuthenticated = !isObjectEmpty(currentUser);
  const gameExists = !isObjectEmpty(currentGame);
  return (
    <List display="flex" py={3} px={5} alignItems="center" bgColor="blue.200">
      <ListItem flexGrow="1">
        <Heading
          size="md"
          textAlign="left"
          bgColor="gray.200"
          borderRadius="15px"
          p={3}
          w="fit-content"
        >
          <Text display="inline" color="red.500">
            Online
          </Text>{" "}
          <Text display="inline" color="blue.500">
            Connect
          </Text>{" "}
          <Text display="inline" color="yellow.500">
            4
          </Text>
        </Heading>
      </ListItem>
      {isAuthenticated ? (
        <ListItem key="logout">
          <LogoutButton />
        </ListItem>
      ) : (
        <></>
      )}
      {gameExists ? (
        <ListItem key="leave-game">
          <LeaveGameButton />
        </ListItem>
      ) : (
        <></>
      )}
    </List>
  );
}
