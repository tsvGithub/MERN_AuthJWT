import React, { useState, useRef, useEffect } from "react";
import Message from "./Message";
import AuthService from "../Services/AuthService";

const Register = (props) => {
  const [user, setUser] = useState({ username: "", password: "", role: "" });
  const [message, setMessage] = useState(null);
  let timerID = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(timerID);
    };
  }, []);

  const onChangeHandler = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setUser({
      username: "",
      password: "",
      role: "",
    });
  };
  const onSubmitHandler = (e) => {
    e.preventDefault();
    AuthService.register(user).then((data) => {
      const { message } = data;
      setMessage(message);
      resetForm();
      if (!message.msgError) {
        timerID = setTimeout(() => {
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
