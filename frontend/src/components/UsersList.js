import React, { useEffect, useState } from "react";
import { useUsers } from "../contexts/UsersContext";
import { useGames } from "../contexts/GamesContext";
import { useHistory } from "react-router-dom";

import UsersListItem from "./UsersListItem";
import InviteUserModal from "./InviteUserModal";

import { isObjectEmpty } from "../utils/utils";
import { Box, Heading, List, VStack } from "@chakra-ui/layout";

export default function UsersList() {
  const { activeUsers: users, setInvitedUser } = useUsers();
  const { currentGame } = useGames();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (currentGame && !isObjectEmpty(currentGame)) {
      history.push("/game");
    }
  }, [currentGame, history]);

  return (
    <Box w="500px" mx="auto">
      <Heading size="lg" textAlign="left" my={5}>
        Players in the Lobby
      </Heading>
      {users.length === 0 ? (
        <Heading size="md" color="red">
          No Users Are Currently in the Lobby! :( <br />
          Please wait for someone to join. <br />
          If you don't want to wait for players, you can open the game from
          another tab and play against yourself.
        </Heading>
      ) : (
        <List as={VStack}>
          {users.map((user) => (
            <UsersListItem
              user={user}
              onInvite={() => {
                setInvitedUser(user);
                setIsModalOpen(true);
              }}
              key={`user-${user.id}`}
            />
          ))}
        </List>
      )}
      <InviteUserModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
    </Box>
  );
}
