import React, { createContext, useContext, useEffect, useState } from "react";

const initialUsersState = {
  currentUser: {},
  updateCurrentUser: () => {},
  invitedUser: {},
  updateInvitedUser: () => {},
  activeUsers: [],
  updateActiveUsers: () => {},
};
const UsersContext = createContext(initialUsersState);

export default function UsersProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(initialUsersState.currentUser);
  const [invitedUser, setInvitedUser] = useState(initialUsersState.invitedUser);
  const [activeUsers, setActiveUsers] = useState(initialUsersState.activeUsers);

  const updateCurrentUser = (newUser) => {
    setCurrentUser((p) => {
      localStorage.setItem("currentUser", JSON.stringify(newUser));
      return newUser;
    });
  };

  const updateInvitedUser = (newUser) => {
    setInvitedUser((p) => {
      localStorage.setItem("invitedUser", JSON.stringify(newUser));
      return newUser;
    });
  };

  const updateActiveUsers = (newUsersList) => {
    setActiveUsers((p) => {
      localStorage.setItem("activeUsers", JSON.stringify(newUsersList));
      return newUsersList;
    });
  };

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!(currentUser === {} || !currentUser)) {
      setCurrentUser(currentUser);
    }

    const invitedUser = JSON.parse(localStorage.getItem("invitedUser"));

    if (!(invitedUser === {} || !invitedUser)) {
      setCurrentUser(invitedUser);
    }

    const activeUsers = JSON.parse(localStorage.getItem("activeUsers"));

    if (typeof activeUsers !== Array || !activeUsers.length) {
      setCurrentUser(invitedUser);
    }
  }, []);

  const value = {
    currentUser,
    updateCurrentUser,
    invitedUser,
    updateInvitedUser,
    activeUsers,
    updateActiveUsers,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
}

export function useUsers() {
  return useContext(UsersContext);
}
