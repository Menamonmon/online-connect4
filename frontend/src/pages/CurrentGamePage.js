import { Box, Heading, HStack, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import { store } from "react-notifications-component";
import Game from "../components/Game";
import GameCell from "../components/GameCell";
import { useGames } from "../contexts/GamesContext";
import { useUsers } from "../contexts/UsersContext";
import { isObjectEmpty, evaluateUsersColors } from "../utils/utils";

export default function CurrentGamePage() {
  const { currentUser, invitedUser } = useUsers();
  const { currentGame } = useGames();
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [{ currentUserColor, invitedUserColor }, setUserColors] = useState({});
  const [warning, setWarning] = useState(
    currentUser.id === currentPlayer.id
      ? "This is your turn"
      : "This is your opponent's turn"
  );

  useEffect(() => {
    if (
      isObjectEmpty(currentGame) ||
      isObjectEmpty(currentUser) ||
      isObjectEmpty(invitedUser)
    ) {
      return;
    }

    // Adding a notification for the winner if it's added to the game
    if (currentGame.winner) {
      const winnerPlayer =
        currentUser.id === currentGame.winner ? currentUser : invitedUser;
      const winnerNotification = {
        title: "Winner",
        message: `${winnerPlayer.name} won this game!!!!!`,
        type: "success",
        insert: "top",
        container: "top-right",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true,
        },
      };
      store.addNotification(winnerNotification);
    }

    const currentPlayer =
      currentGame.current_player === currentUser.id ? currentUser : invitedUser;

    setCurrentPlayer(currentPlayer);
    if (currentGame.winner) {
      setWarning("There is a winner already!!");
    } else {
      setWarning(
        currentPlayer.id === currentUser.id
          ? "This is your turn"
          : "This is your opponent's turn."
      );
    }
    setUserColors(evaluateUsersColors(currentUser, invitedUser, currentGame));
  }, [currentGame, currentUser, invitedUser]);

  return isObjectEmpty(currentGame) ? (
    <Heading>Ending the game because one of the plyers left</Heading>
  ) : (
    <HStack
      bgColor="gray.100"
      h="fit-content"
      maxW="750px"
      mx="auto"
      p={3}
      borderRadius="15px"
      my={3}
    >
      <VStack textAlign="left" w="100%">
        <VStack w="100%">
          <HStack
            justify="space-between"
            px={2}
            w="100%"
            bgColor="blue.200"
            borderRadius="15px"
            py={2}
          >
            <Heading size="sm" color="green">
              You: {currentUser.name}
            </Heading>
            <GameCell state={currentUserColor} custom width="5vh" />
          </HStack>
          <HStack
            justify="space-between"
            px={2}
            w="100%"
            bgColor="blue.200"
            borderRadius="15px"
            py={2}
          >
            <Heading size="sm" color="red">
              Opponent: {invitedUser.name}
            </Heading>
            <GameCell state={invitedUserColor} custom width="5vh" />
          </HStack>
        </VStack>
        <Box w="100%">
          <Heading size="md" color="blue.500">
            Stats:
          </Heading>
          <Heading size="sm">Current Player: {currentPlayer.name}</Heading>
          <Heading size="sm">
            Winner:{" "}
            {currentGame.winner
              ? currentGame.winner === currentUser.id
                ? currentUser.name
                : invitedUser.name
              : "Not Yet :("}
          </Heading>
          <Heading size="sm" color="yellow.600">
            {warning}
          </Heading>
        </Box>
      </VStack>
      <Game
        useWarning={() => [warning, setWarning]}
        playerColor={
          currentPlayer.id === currentUser.id ? currentUserColor : null
        }
      />
    </HStack>
  );
}
