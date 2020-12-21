import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
//fetch
import AuthService from "../Services/AuthService";

// (8)
const Register = (props) => {
  // 8a set state
  const [user, setUser] = useState({ username: "", password: "", role: "" });
  const [message, setMessage] = useState(null);
  //8b useRef creates an istance var because of useing
  //setTimeout method
  let timerID = useRef(null);

  // 8c cleans up the setTimeout function
  useEffect(() => {
    //===component did unmout
    return () => {
      clearTimeout(timerID);
    };
  }, []);
  //8e
  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };
  //8f
  const resetForm = () => {
    setUser({
      username: "",
      password: "",
      role: "",
    });
  };

  //8d
  const onSubmitHandler = (e) => {
    e.preventDefault();
    //fetch ('/register') with user from form
    AuthService.register(user).then((data) => {
      //pull out {stuff=the message} from response parsed data
      const { message } = data;
      //update message from useState
      setMessage(message);
      //clean form
      resetForm();
      //if there is no error because user successfully
      //created account => navigate user to Login page
      if (!message.msgError) {
        //set timer to show to user success message for 2 sec
        timerID = setTimeout(() => {
          //navigate user to Login page
          props.history.push("/login");
        }, 2000);
      }
    });
  };

  return (
    <div>
      <form onSubmit={onSubmitHandler}>
        <h3>Register</h3>
        <label htmlFor="username" className="sr-only">
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={user.username}
          onChange={onChangeHandler}
          className="form-control"
          placeholder="Enter Username"
        />
        <label htmlFor="password" className="sr-only">
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={onChangeHandler}
          className="form-control"
          placeholder="Enter Password"
        />
        <label htmlFor="role" className="sr-only">
          Role:
        </label>
        <input
          type="text"
          name="role"
          value={user.role}
          onChange={onChangeHandler}
          className="form-control"
          placeholder="Enter Role (admin/user)"
        />

        <button type="submit" className="btn btn-lg btn-primary btn-block">
          Register
        </button>
      </form>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Register;
