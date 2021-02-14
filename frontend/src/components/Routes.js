import { Switch } from "react-router-dom";
import SignupPage from "../pages/SignupPage";
import UserInvitePage from "../pages/UserInvitePage";
import ProtectedRoute from "./ProtectedRoute";
import UsersList from "./UsersList";

export default function Routes({
  user,
  activeUsers,
  updateUser,
  currentGame,
  updateGame,
  invitedUser,
  updateInvitedUser,
}) {
  const userExists = Object.keys(user).length !== 0;
  const invitedUserExists = Object.keys(invitedUser).length !== 0;
  const currentGameExists = Object.keys(currentGame).length !== 0;

  return (
    <Switch>
      <ProtectedRoute
        exact
        strict
        path="/signup"
        isAuthenticated={() => !userExists}
        redirectPath="/users-list"
        component={() => <SignupPage updateUser={updateUser} />}
      />
      <ProtectedRoute
        exact
        strict
        path="/users-list"
        isAuthenticated={() => userExists}
        redirectPath="/signup"
        component={() => (
          <UsersList
            users={activeUsers}
            updateInvitedUser={updateInvitedUser}
          />
        )}
      />
      <ProtectedRoute
        exact
        strict
        path="/invite-user"
        isAuthenticated={() =>
          invitedUserExists && userExists && !currentGameExists
        }
        redirectPath={currentGameExists ? "/game" : "/signup"}
        component={() => (
          <UserInvitePage
            currentUser={user}
            invitedUser={invitedUser}
            updateGame={updateGame}
          />
        )}
      />
      <ProtectedRoute
        exact
        strict
        path="/game"
        isAuthenticated={() => currentGameExists}
        redirectPath="/signup"
        component={() => <pre>{JSON.stringify(currentGame, undefined, 2)}</pre>}
      />
    </Switch>
  );
}
