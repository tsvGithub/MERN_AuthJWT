//contain fetch request through endpoints that
//created in BE
//AuthService will store fetch
//1
//Object contains a buch of convenience functions:
export default {
  //----------------------------------
  // 1a
  //func login takes a user
  login: (user) => {
    console.log(user);
    //configuration for fetch:
    return fetch(
      //endpoint
      "/user/login",
      //options
      {
        //post request
        method: "post",
        //body need send as JSON => convert to JSON
        //pass in a user
        body: JSON.stringify(user),
        //headers let BE to know what is sending
        headers: {
          "Content-Type": "application/json",
        },
      }
      //promise returns a response
    ).then((res) => {
      //
      if (res.status !== 401) {
        //get data that parsed now
        return res.json().then((data) => data);
      }
      //if not authorized
      else {
        //return false & empty strings for user
        return { isAuthenticated: false, user: { username: "", role: "" } };
      }
    });
  },
  //------------------------------------
  //1b
  register: (user) => {
    console.log(user);
    return fetch("/user/register", {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => data);
  },
  //---------------------------------------
  //1c
  logout: () => {
    return fetch("/user/logout")
      .then((res) => res.json())
      .then((data) => data);
  },
  //------------------------------------------
  //1d
  //to persist authentication === сохранить аутентификацию
  //once user is logeed in we set a state within
  //REACT Component to let App know that user has
  //been authenticated.
  //When you closte React app that state is gone.
  //So isAuthenticated syncs BE & FE together
  isAuthenticated: () => {
    return (
      fetch("/user/authenticated")
        //
        .then((res) => {
          // if authentication fails, Passport will respond with a 401 Unauthorized status,
          //and any additional route handlers will not be invoked.
          //If authentication succeeds, the next handler will be invoked and the
          //req.user property will be set to the authenticated user.
          if (res.status !== 401) return res.json().then((data) => data);
          //if passport is sending 401 status code:
          else {
            //set authentication to false, as user is unauthorized
            //set user object to empty string
            return { isAuthenticated: false, user: { username: "", role: "" } };
          }
        })
    );
  },
};
