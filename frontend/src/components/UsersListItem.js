import React from "react";
import { Link } from "react-router-dom";

import { useTypes } from "../contexts/TypesContext";

const matchUserStatus = (status, types) => {
  const keys = Object.keys(types);
  const values = Object.values(types);

  const valIndex = values.indexOf(status);
  if (!(valIndex >= 0)) {
    return "";
  }

  return keys[valIndex].toLowerCase();
};

export default function UserListItem({
  user: { name, status, created_at },
  onClick,
}) {
  const { user: userTypes } = useTypes();
  const createdAt = new Date(created_at);
  return (
    <Link to="/invite-user" onClick={onClick}>
      <div className="user-list-item">
        <h3 className="user-name">{name}</h3>
        <h4
          className="user-status"
          style={{
            textTransform: "capitalize",
          }}
        >
          {matchUserStatus(status, userTypes)}
          <br />
          Joined Since{" "}
          {`${createdAt.getMonth()}/${createdAt.getDate()}/${createdAt.getFullYear()}`}
        </h4>
      </div>
    </Link>
  );
}
