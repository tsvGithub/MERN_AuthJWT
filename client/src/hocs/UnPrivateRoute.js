import React, { useContext } from "react";
import { Redirect, Route } from "react-router";
//global state
import { AuthContext } from "../Context/AuthContext";

//15
//pass in props {stuff: Component and other rest props}
const UnPrivateRoute = ({ component: Component, ...rest }) => {
  //15a pull out from global state
  const { isAuthenticated } = useContext(AuthContext);
  //
  return (
    //only chack if user is authenticated
    <Route
      //15b  pass as props {spred ...rest} in Route component
      {...rest}
      /*dynamic render: */
      render={(props) => {
        //check global state for isAuthenticated
        if (isAuthenticated) return <Redirect to={{ pathname: "/", state: { from: props.location } }} />;
        //if not authenticated: render Component
        return <Component {...props} />;
      }}
    />
  );
};

export default UnPrivateRoute;
