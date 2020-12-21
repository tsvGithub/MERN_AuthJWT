import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
//Components
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Todos from "./Components/Todos";
import Admin from "./Components/Admin";
//14
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";
//4
function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />

      {/*------------------------- */}
      <UnPrivateRoute path="/login" component={Login} />
      {/* <Route path="/login" component={Login} /> */}
      {/* <Route path="/register" component={Register} /> */}
      <UnPrivateRoute path="/register" component={Register} />

      {/* 14a ------------------------- */}
      {/* prop roles is [array of the roles that are able to acces to TODO component] */}
      <PrivateRoute path="/todos" roles={["user", "admin"]} component={Todos} />
      <PrivateRoute path="/admin" roles={["admin"]} component={Admin} />
      {/* <Route path="/todos" component={Todos} /> */}
      {/* <Route path="/admin" component={Admin} /> */}
    </Router>
  );
}

export default App;
