import React, { createContext, useContext, useState } from "react";

const initialUsersState = {
  currentUser: {},
  invitedUser: {},
  activeUsers: [],
};
const UsersContext = createContext(initialUsersState);

export default function UsersProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialUsersState.currentUser);
  const [invitedUser, setInvitedUser] = useState(initialUsersState.invitedUser);
  const [activeUsers, setActiveUsers] = useState(initialUsersState.activeUsers);

  return (
    <UsersContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        invitedUser,
        setInvitedUser,
        activeUsers,
        setActiveUsers,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
