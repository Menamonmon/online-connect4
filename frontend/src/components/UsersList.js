import React, { useState } from "react";
import { useUsers } from "../contexts/UsersContext";
import { useGames } from "../contexts/GamesContext";
import { Link } from "react-router-dom";
import UsersListItem from "./UsersListItem";
import InviteUserModal from "./InviteUserModal";

import { isObjectEmpty } from "../utils/utils";

export default function UsersList() {
  const { activeUsers: users, setInvitedUser } = useUsers();
  const { currentGame } = useGames();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      {!currentGame || isObjectEmpty(currentGame) ? (
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
      ) : (
        <>
          <h1>
            Please go back the game your are currently in and end it from there
          </h1>
          <Link to="/game">Go Back to Game</Link>
        </>
      )}
      <InviteUserModal isOpen={isModalOpen} setOpen={setIsModalOpen} />
    </div>
  );
}
