import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// 3
import AuthProvider from "./Context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

ReactDOM.render(
  //AuthProvider is func from Context->AuthContext->export default({children})
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
