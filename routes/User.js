// 4
const express = require("express");
const userRouter = express.Router();
// use passport configuration from (3)
const passport = require("passport");
// ???
const passportConfig = require("../passport");

const User = require("../models/User");
const Todo = require("../models/Todo");
//jwt token
const JWT = require("jsonwebtoken");

//-------------------------------------
//(4ba)
//userId===primary key _id
const signToken = (userId) => {
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  //jwt.sign returns the actual jwt token
  return JWT.sign(
    {
      //payload: send back all you want except sensitive data!

      //iss===issuer => who issued (vypustil) this jwt token?
      //The "iss" value is a case-sensitive string containing a StringOrURI
      //value.  Use of this claim is OPTIONAL
      iss: "someStirng",
      //sub===subject => who is this JWT token for?
      //для кого предназначен этот токен JWT?
      // The "sub" value is a case-sensitive string containing a StringOrURI
      //value.  Use of this claim is OPTIONAL.
      //userId===primary key _id of the user
      sub: userId,
    },
    //second arg is the key that you want to sign with.
    //make sure it matches the secretOrKey in
    //passport.js (3b) secretOrKey: process.env.secretOrKey,
    //passport will be use this secretOrKey to verify
    //that this token is legitimate
    //they have to match
    process.env.secretOrKey,
    //option: expires in (1day, 1hour, 5000)
    { expiresIn: "1h" }
  );
};

//--------------------------
// (4a) SIGN UP
userRouter.post("/register", (req, res) => {
  //pull out username, password, role from the req.body
  const { username, password, role } = req.body;
  //if username exist
  //cb wirh err & user
  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ message: { msgBody: `DB Error ${err} !`, msgError: true } });
    }
    //if user already exist
    if (user) {
      res
        .status(400)
        .json({ message: { msgBody: "Username already exist, do you want Login instead?", msgError: true } });
    } else {
      //if no user with that name:
      //create new User with username, password and role from FE
      const newUser = new User({ username, password, role });
      newUser.save((err) => {
        if (err) {
          res.status(500).json({ message: { msgBody: `DB Error ${err}!`, msgError: true } });
        } else {
          res.status(201).json({ message: { msgBody: "Thank you! Account created.", msgError: false } });
        }
      });
    }
  });
});
//---------------------------
// (4b) LOGIN + (3a)'local startegy' +(4ba) create JWT token
//login route with passport middleware: (strategy we use to authenticate==='local'
//We created (3a) a local strategy in passport.js -> passport.use(new LocalStrategy(username,password,done)),
//second -> {set the session to false} so the server is not maintaining the session
userRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
  //if user is authenticated
  //isAuthenticated() added by Passport by default
  //returns boolean (true/false)
  if (req.isAuthenticated()) {
    //pull out the primary key _id, username, role from
    //req.user comes from (3a) passport.js
    //passport.use(new LocalStrategy)
    const { _id, username, role } = req.user;
    //------------------------
    //user is signed in => we can create JWT token
    //func signToken with primary key
    //see above (4ba)
    const token = signToken(_id);
    //---------------------------------
    //set the cookie as the access token
    res.cookie(
      "access_token",
      //pass in jwt token
      token,
      //SECURITY: JWT token doesn't get stolen
      //set some options : httpOnly=>makes that on
      //the client side you cannot touch this cookie
      //using JS and prevents against cross-site
      //scripting attacks
      //sameSite property is to protect against cross-site
      //forgery attacks===poddelka, podlog,falj6ivka
      { httpOnly: true, sameSite: true }
    );
    //sending back response
    res.status(200).json(
      //isAuthenticated: true because the user is successfully logged in
      {
        isAuthenticated: true,
        //send back user with username and role
        user: { username, role },
      }
    );
  } else {
    const { username } = req.user;
    User.findOne({ username }, (err, user) => {
      if (err) {
        res.status(500).json({ message: { msgBody: `DB Error ${err}`, msgError: true } });
      }
      if (!user) {
        res
          .status(400)
          .json({ message: { msgBody: "Username does't exist, do you want Sign Up instead?", msgError: true } });
      }
    });
  }
});
//---------------------------------
//LOGOUT (4c)
//logout route with passport middleware: (strategy we use to authorization==='jwt'(to protect endpoints)
//We created (3b) a JwT strategy in passport.js -> passport.use(new JwtStrategy()),
//second -> {set the session to false} so the server is not maintaining the session
userRouter.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
  //clear the cookie (access token) => delete access JWT token
  //need to sign again if need access to site
  res.clearCookie("access_token");
  //return empty user object
  res.json({ user: { username: "", role: "" }, success: true });
});

//=======================================
//Create TODO for user (4d)
//todo route with passport middleware: (strategy we use to authorization==='jwt'(to protect endpoints)
//We created (3b) a JwT strategy in passport.js -> passport.use(new JwtStrategy()),
//second -> {set the session to false} so the server is not able maintaining the session

//you have to be logged in (JWT token) in order to create to-do
userRouter.post("/todo", passport.authenticate("jwt", { session: false }), (req, res) => {
  //create an instance of mongoose model
  //req.body comes from client
  const todo = new Todo(req.body);
  todo.save((err) => {
    if (err) {
      res.status(500).json({ message: { msgBody: `DB Error ${err} `, msgError: true } });
    } else {
      //req.user is added by passport.
      //Passport attaches the user to the request object
      //this user is from DB.
      //in Model->User.js (2) we have [] of todos
      //adding todo to the array within user
      req.user.todos.push(todo);
      //save
      req.user.save((err) => {
        if (err) {
          res.status(500).json({ message: { msgBody: `DB Error ${err} `, msgError: true } });
        } else {
          res.status(200).json({ message: { msgBody: "Todo creted!", msgError: false } });
        }
      });
    }
  });
});
//----------------------------
//Read todo (4e)
//todos route with passport middleware: (strategy we use to authorization==='jwt'(to protect endpoints)
//We created (3b) a JwT strategy in passport.js -> passport.use(new JwtStrategy()),
//second -> {set the session to false} so the server is not able maintaining the session

//you have to be logged in (JWT token) in order to read to-dos
userRouter.get("/todos", passport.authenticate("jwt", { session: false }), (req, res) => {
  //req.user is added by passport.
  //Passport attaches the user to the request object
  //this user is from DB.
  //_id===primary key
  User.findById({ _id: req.user._id })
    //when we find the user, the todos array only
    //have primary keys within it. We need to
    //populate it with actual data of todos
    .populate("todos")
    //document===record in MongoDB collection
    .exec((err, document) => {
      if (err) {
        res.status(500).json({ message: { msgBody: `DB Error ${err} `, msgError: true } });
      } else {
        //send back todos => document.todos & send back
        //set authenticated (for frontend) to true to let to know that user is still logged in
        res.status(200).json({ todos: document.todos, authenticated: true });
      }
    });
});
//---------------------------------
// check if Adimn panel (role) (4f)
//passport.authenticate("jwt") sends unauthorized request
//if user don't have JWT token
userRouter.get("/admin", passport.authenticate("jwt", { session: false }), (req, res) => {
  //user is authorized
  //check if user has right permissions === admin
  if (req.user.role === "admin") {
    res.status(200).json({ message: { msgBody: "Hello, Admin!", msgError: false } });
  } else {
    //403===not authorized !== admin
    res.status(403).json({ message: { msgBody: "You do not have permission to be here!", msgError: true } });
  }
});
//----------------------------
//for FE (4g)
//if user logged in, save in the state that user is logged in
//if user closes browser, the state gets reset
//this endpoint makes sure that BE & FE is synced in.
//to keep user still logged in if he was authenticated
userRouter.get("/authenticated", passport.authenticate("jwt", { session: false }), (req, res) => {
  //pull out username & role from req.user
  const { username, role } = req.user;
  //send back
  //user is authenticated & user information
  res.status(200).json({ isAuthenticated: true, user: { username, role } });
});

module.exports = userRouter;
