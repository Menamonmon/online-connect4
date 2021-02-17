import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import { useGames } from "../contexts/GamesContext";
import { useUsers } from "../contexts/UsersContext";
import CurrentGamePage from "../pages/CurrentGamePage";
import SignupPage from "../pages/SignupPage";
import UserInvitePage from "../pages/UserInvitePage";
import { isObjectEmpty } from "../utils/utils";
import ProtectedRoute from "./ProtectedRoute";
import UsersList from "./UsersList";

export default function Routes() {
  const { currentUser, invitedUser } = useUsers();
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
  }, []);

  return (
    <Switch>
      <Route exact strict path="/" component={CurrentGamePage}/>
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
        path="/invite-user"
        isAuthenticated={() =>
          exists.invitedUser && exists.currentUser && !exists.currentGame
        }
        redirectPath={exists.currentGame ? "/game" : "/signup"}
        component={UserInvitePage}
      />
      <ProtectedRoute
        exact
        strict
        path="/game"
        isAuthenticated={() => exists.currentGame}
        redirectPath="/signup"
        component={CurrentGamePage}
      />
    </Switch>
  );
}
