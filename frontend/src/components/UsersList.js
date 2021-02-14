import React from "react";
import UsersListItem from "./UsersListItem";

export default function UsersList({ users, updateInvitedUser }) {
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
