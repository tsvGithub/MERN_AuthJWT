import React, { useState, useContext } from "react";
//fetch
import AuthService from "../Services/AuthService";
//global state
import { AuthContext } from "../Context/AuthContext";
//Message displays messages from the Server
import Message from "../Components/Message";

//6
const Login = (props) => {
  //6a set state:
  const [user, setUser] = useState({ username: "", password: "" });
  const [message, setMessage] = useState(null);
  //6b global context
  const authContext = useContext(AuthContext);

  //6d change user state
  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };
  //6e Submit btn
  const onSubmit = (e) => {
    // debugger;
    e.preventDefault();
    //fetch ('/login') with user from form
    AuthService.login(user).then((data) => {
      console.log(data);
      //pull {stuff} from response parsed data
      const { isAuthenticated, user, message } = data;
      //if isAuthenticated===true
      if (isAuthenticated) {
        //update global state of user => (updated userr
        authContext.setUser(user);
        //update the isAuthenticated state => isAuthenticated(true)
        authContext.setIsAuthenticated(isAuthenticated);
        //navigate user to todo page
        props.history.push("/todos");
      } else {
        //if isAuthenticated===false =>display error message from server
        setMessage(message);
      }
      // if (!user) {
      //   setMessage(message);
      // }
    });
    // if (!user) {
    setMessage(message.msgError);
    // }
  };

  //6c
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h3>Please sign in</h3>
        <label htmlFor="username" className="sr-only">
          Username:{" "}
        </label>
        <input type="text" name="username" onChange={onChange} className="form-control" placeholder="Enter Username" />
        <label htmlFor="password" className="sr-only">
          Password:{" "}
        </label>
        <input
          type="password"
          name="password"
          onChange={onChange}
          className="form-control"
          placeholder="Enter Password"
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Log in{" "}
        </button>
      </form>
      {/*if message !==null display message from server OR do nothing   */}
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Login;
