import React, { Fragment } from "react";

import { Heading, HStack, ListItem, Text } from "@chakra-ui/layout";
import { List } from "@chakra-ui/react";

import { useUsers } from "../contexts/UsersContext";
import { useGames } from "../contexts/GamesContext";

import LeaveGameButton from "./LeaveGameButton";
import LogoutButton from "./LogoutButton";

import { isObjectEmpty } from "../utils/utils";
import ReplayGameButton from "./ReplayGameButton";

export default function Navbar() {
  const { currentUser } = useUsers();
  const { currentGame } = useGames();

  const isAuthenticated = !isObjectEmpty(currentUser);
  const gameExists = !isObjectEmpty(currentGame);
  return (
    <List
      display="flex"
      py={3}
      px={5}
      alignItems="center"
      bgColor="blue.50"
      as={HStack}
    >
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
      {gameExists && (
        <Fragment>
          <ListItem key="replay">
            <ReplayGameButton />
          </ListItem>
          <ListItem key="leave-game">
            <LeaveGameButton />
          </ListItem>
        </Fragment>
      )}
      {isAuthenticated && (
        <ListItem key="logout">
          <LogoutButton />
        </ListItem>
      )}
    </List>
  );
}
