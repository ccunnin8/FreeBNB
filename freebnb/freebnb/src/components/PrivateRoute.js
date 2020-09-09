import { Redirect, Route } from "react-router-dom";
import React, { useContext } from "react";
import { UserContext } from "./auth/UserContext";
import  { tokenNotExpired } from "./auth/tokenNotExpired";

const PrivateRoute = ({ children, ...rest }) => {
    const { userState } = useContext(UserContext);

    return <Route {...rest} render={({location}) => userState.loggedIn || !tokenNotExpired() ? ( children ) : (
        <Redirect to={{ pathname: "/login", state: { from: location }}} />
    )} />
}

export default PrivateRoute;