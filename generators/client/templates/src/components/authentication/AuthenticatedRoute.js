import React from "react";
import { Redirect, Route } from "react-router";

const AuthenticationCheck = ({ component: Component, user, ...rest }) => {
  if (user === undefined) {
    return <div>Loading...</div>
  }
  if (user !== null) {
    return <Component user={user} {...rest} />;
  }
  return <Redirect to="/user-sessions/new" />;
};

const AuthenticatedRoute = ({ component, user, ...rest }) => {
  return (
    <Route
      {...rest}
    >
      <AuthenticationCheck user={user} component={component} {...rest} />
    </Route>
  );
};

export default AuthenticatedRoute;