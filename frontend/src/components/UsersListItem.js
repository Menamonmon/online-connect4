import React from "react";
import { Link } from "react-router-dom";

export default function UserListItem({
  user: { name, status, created_at, id },
  onClick,
}) {
  const createdAt = new Date(created_at);
  return (
    <Link to="/invite-user" onClick={onClick}>
      <div className="user-list-item">
        <h3 className="user-name">{name}</h3>
        <h4 className="user-status">
          {status}
          <br />
          Joined Since{" "}
          {`${createdAt.getMonth()}/${createdAt.getDate()}/${createdAt.getFullYear()}`}
        </h4>
      </div>
    </Link>
  );
}
