import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
function App() {
  return (
    <Router>
      <Navbar />
      <Route exact path="/" component={Home} />
    </Router>
  );
}

export default App;
