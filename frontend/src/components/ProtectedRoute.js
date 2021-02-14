import React from "react";
import { Redirect, Route } from "react-router-dom";

export default function ProtectedRoute({
  component: Component,
  isAuthenticated,
  redirectPath,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={() => {
        if (isAuthenticated()) {
          return <Component />;
        } else {
          return <Redirect to={redirectPath} />;
        }
      }}
    />
  );
}
