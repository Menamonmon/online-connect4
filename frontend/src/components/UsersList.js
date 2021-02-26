import React, { useState } from "react";
import { useUsers } from "../contexts/UsersContext";
import UsersListItem from "./UsersListItem";
import InviteUserModal from "./InviteUserModal";

export default function UsersList() {
  const { activeUsers: users, setInvitedUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
