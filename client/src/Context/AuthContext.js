import React, { createContext, useEffect, useState } from "react";
import AuthService from "../Services/AuthService";

//2 
export const AuthContext = createContext();

//it will be used in (3)index.js <AuthProvider>
//children===App.js component that we wrap the provider around
export default ({ children }) => {
  //user===user that is logged in
  const [user, setUser] = useState(null);
  //isAuthenticated===if this user is authenticated or not
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  //isLoaded is boolean value to see if the app is loaded
  //once we get the data => isLoaded===true
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    //use AuthService func (1d) isAuthenticated
    AuthService.isAuthenticated()
      //get back data
      .then((data) => {
        setIsLoaded(true);
        //set state
        setUser(data.user);
        //-----------------------
        // (BE 4b routes->login)//if user is logged in
        //isAuthenticated() added by Passport by default
        //returns boolean (true/false)
        //isAuthenticated: true because the user is successfully logged in
        // {isAuthenticated: true,
        ////send back user with username and role
        //   user: { username, role },}------------------------
        setIsAuthenticated(data.isAuthenticated);
        //
        setIsLoaded(false);
      });
  }, []);

  return (
    <div>
      {isLoaded ? (
        <h1>Loading...</h1>
      ) : (
        //provide 'global state' user, setUser, isAuthenticated, setIsAuthenticated
        //to children===components
        <AuthContext.Provider value={{ user, setUser, isAuthenticated, setIsAuthenticated }}>
          {children}
        </AuthContext.Provider>
      )}
    </div>
  );
};
