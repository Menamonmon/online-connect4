import React, { createContext, useContext,  useState } from "react";

const initialUsersState = {
  currentUser: {},
  invitedUser: {},
  activeUsers: [],
};
const UsersContext = createContext(initialUsersState);

export default function UsersProvider({ children, value: inheritedValue }) {
  const [currentUser, setCurrentUser] = useState(
    inheritedValue.currentUser || initialUsersState.currentUser
  );
  const [invitedUser, setInvitedUser] = useState(
    inheritedValue.invitedUser || initialUsersState.invitedUser
  );
  const [activeUsers, setActiveUsers] = useState(
    inheritedValue.activeUsers || initialUsersState.activeUsers
  );

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
