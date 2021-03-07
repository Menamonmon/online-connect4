import { useEffect, useState } from "react";
import { Switch } from "react-router-dom";
import { useGames } from "../contexts/GamesContext";
import { useUsers } from "../contexts/UsersContext";
import CurrentGamePage from "../pages/CurrentGamePage";
import SignupPage from "../pages/SignupPage";
import { isObjectEmpty } from "../utils/utils";
import ProtectedRoute from "./ProtectedRoute";
import UsersList from "./UsersList";

export default function Routes() {
  const { currentUser, invitedUser, activeUsers } = useUsers();
  const { currentGame } = useGames();

  let [exists, setExists] = useState({
    currentUser: false,
    invitedUser: false,
    currentGame: false,
  });

  useEffect(() => {
    const newExists = {
      currentUser: !isObjectEmpty(currentUser),
      invitedUser: !isObjectEmpty(invitedUser),
      currentGame: !isObjectEmpty(currentGame),
    };
    setExists(newExists);
  }, [currentUser, invitedUser, currentGame, activeUsers, setExists]);

  return (
    <Switch>
      <ProtectedRoute
        exact
        strict
        path="/"
        isAuthenticated={() => false}
        redirectPath="/signup"
        component={() => <></>}
      />
      <ProtectedRoute
        exact
        strict
        path="/signup"
        isAuthenticated={() => !exists.currentUser}
        redirectPath="/users-list"
        component={SignupPage}
      />
      <ProtectedRoute
        exact
        strict
        path="/users-list"
        isAuthenticated={() => exists.currentUser}
        redirectPath="/signup"
        component={UsersList}
      />
      <ProtectedRoute
        exact
        strict
        path="/game"
        isAuthenticated={() =>
          exists.currentGame && exists.currentUser && exists.invitedUser
        }
        redirectPath="/signup"
        component={CurrentGamePage}
      />
    </Switch>
  );
}
