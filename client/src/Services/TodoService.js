//contain fetch request through endpoints that
//created in BE
//TodoService will store fetch
//10
//Object contains a buch of convenience functions:
export default {
  //10a get all todos
  getTodos: () => {
    return fetch("/user/todos").then((response) => {
      //if user is authorized
      if (response.status !== 401) {
        //get todos
        return response.json().then((data) => data);
        //if not authorized
      } else return { message: { msgBody: "UnAuthorized", msgError: true } };
    });
  },
  //10b create a new todo
  postTodo: (todo) => {
    return fetch(
      //endpoint
      "/user/todo",
      //options
      {
        //post request
        method: "post",
        //stringify todo (convert into JSON)
        body: JSON.stringify(todo),
        //specify that is JSON
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      //if authorized
      if (response.status !== 401) {
        //get data that parsed now
        return response.json().then((data) => data);
        //if not authorized
      } else return { message: { msgBody: "UnAuthorized" }, msgError: true };
    });
  },
};
