import React, { useEffect, useState } from "react";
import { useUsers } from "../contexts/UsersContext";
import { useGames } from "../contexts/GamesContext";
import { useHistory } from "react-router-dom";

import UsersListItem from "./UsersListItem";
import InviteUserModal from "./InviteUserModal";

import { isObjectEmpty } from "../utils/utils";

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
    <div>
      <li className="users-list">
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
      </li>
      <InviteUserModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
}
