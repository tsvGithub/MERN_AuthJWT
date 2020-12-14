import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Todos from "./Components/Todos";
import Admin from "./Components/Admin";
import PrivateRoute from "./hocs/PrivateRoute";
import UnPrivateRoute from "./hocs/UnPrivateRoute";

function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />

      <UnPrivateRoute path="/login" component={Login} />
      {/* <Route path="/login" component={Login} /> */}
      {/* <Route path="/register" component={Register} /> */}
      <UnPrivateRoute path="/register" component={Register} />

      <PrivateRoute path="/todos" roles={["user", "admin"]} component={Todos} />
      {/* <Route path="/todos" component={Todos} /> */}
      {/* <Route path="/admin" component={Admin} /> */}
      <PrivateRoute path="/admin" roles={["admin"]} component={Admin} />
    </Router>
  );
}

export default App;
