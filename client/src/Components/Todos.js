import React, { useState, useContext, useEffect } from "react";
//for one todo item
import TodoItem from "./TodoItem";
//fetch for todos
import TodoService from "../Services/TodoService";
//
import Message from "./Message";
//global state
import { AuthContext } from "../Context/AuthContext";

// 9
const Todos = (props) => {
  //9a set up state
  const [todo, setTodo] = useState({ name: "" });
  const [todos, setTodos] = useState([]);
  const [message, setMessage] = useState(null);
  //global state
  const authContext = useContext(AuthContext);

  //9b === component did mount
  useEffect(() => {
    //fetch
    TodoService.getTodos().then((data) => {
      //update Todos array state
      setTodos(data.todos);
    });
  }, []);

  //9g
  const onSubmit = (e) => {
    e.preventDefault();
    //fetch
    TodoService.postTodo(todo).then((data) => {
      //pull out message from data
      const { message } = data;
      //reset Form (9e)
      resetForm();

      //check errors
      //if there isn't errors
      if (!message.msgError) {
        //fetch get all Todos => updated list of Todo
        TodoService.getTodos().then((getData) => {
          //update Todos data
          setTodos(getData.todos);
          //updayte Message state: successefully create todo
          setMessage(message);
        });
        //if there is error
        //if unAuthotized === jwt token expired
      } else if (message.msgBody === "UnAuthorized") {
        //update Message state
        setMessage(message);
        //update the global user state
        authContext.setUser({ username: "", role: "" });
        //update global state authorized === false
        authContext.setIsAuthenticated(false);
      } else {
        //or BE message
        setMessage(message);
      }
    });
  };

  //9d
  const onChange = (e) => {
    setTodo({ name: e.target.value });
  };
  //9e
  const resetForm = () => {
    setTodo({ name: "" });
  };

  //9c
  return (
    <div>
      <ul className="list-group">
        {/*display Todo items */}
        {todos.map((todo) => {
          return <TodoItem key={todo._id} todo={todo} />;
        })}
      </ul>
      <br />
      <form onSubmit={onSubmit}>
        <label htmlFor="todo">Enter Todo</label>
        <input
          type="text"
          name="todo"
          value={todo.name}
          onChange={onChange}
          className="form-control"
          placeholder="Please Enter Todo"
        />
        <button className="btn btn-lg btn-primary btn-block" type="submit">
          Submit
        </button>
      </form>
      {message ? <Message message={message} /> : null}
    </div>
  );
};

export default Todos;
