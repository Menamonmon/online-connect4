import React from "react";
import { useUsers } from "../contexts/UsersContext";
import UsersListItem from "./UsersListItem";

export default function UsersList() {
  let { activeUsers: users, updateInvitedUser } = useUsers();

  return (
    <li className="users-list">
      {users.map((user) => (
        <UsersListItem
          user={user}
          onClick={() => updateInvitedUser(user)}
          key={`user-${user.id}`}
        />
      ))}
    </li>
  );
}
