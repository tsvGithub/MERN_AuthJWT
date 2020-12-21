import React, { useContext } from "react";
import { Link } from "react-router-dom";
//logout
import AuthService from "../Services/AuthService";
//global state
import { AuthContext } from "../Context/AuthContext";

//5
const Navbar = (props) => {
  //5b useContext
  //pull out {stuff} from AuthContext global state
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useContext(AuthContext);
  //---------------------------
  // 5e
  const onClickLogoutHandler = () => {
    //use (1) AuthService func logout
    AuthService.logout().then((data) => {
      //if successfully logged out or not
      if (data.success) {
        //set user to empty string
        setUser(data.user);
        //set isAuthenticated to false
        setIsAuthenticated(false);
      }
    });
  };
  //---------------------------------
  //5c
  const unauthenticatedNavBar = () => {
    return (
      <>
        <Link to="/">
          <li className="nav-item nav-link">Home</li>
        </Link>
        <Link to="/login">
          <li className="nav-item nav-link">Login</li>
        </Link>
        <Link to="/register">
          <li className="nav-item nav-link">Register</li>
        </Link>
      </>
    );
  };
  //------------------------------------
  // 5d
  const authenticatedNavBar = () => {
    return (
      <>
        <Link to="/">
          <li className="nav-item nav-link">Home</li>
        </Link>
        <Link to="/todos">
          <li className="nav-item nav-link">Todos</li>
        </Link>
        {/* two types of authenticated users:
        admin or regular user */}
        {user.role === "admin" ? (
          <Link to="/admin">
            <li className="nav-item nav-link">Admin</li>
          </Link>
        ) : null}
        <button type="button" className="btn btn-link nav-item nav-link" onClick={onClickLogoutHandler}>
          LOGOUT
        </button>
      </>
    );
  };
  //==========================================
  return (
    // 5a
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link to="/">
        <div className="navbar-brand">Home</div>
      </Link>
      <div className="navbar" id="navbarText">
        {/* <div className="collapse navbar-collapse" id="navbarText"> */}
        <ul className="navbar-nav mr-auto">{!isAuthenticated ? unauthenticatedNavBar() : authenticatedNavBar()}</ul>
      </div>
    </nav>
  );
};

export default Navbar;
