const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");
const { eventNames } = require("../models/User");

const signToken = (userId) => {
  //jwt.sign(payload, secretOrPrivateKey, [options, callback])
  return JWT.sign(
    {
      //    The "iss" (issuer) claim identifies the principal that issued the
      //    JWT.  The processing of this claim is generally application specific.
      //    The "iss" value is a case-sensitive string containing a StringOrURI
      //    value.  Use of this claim is OPTIONAL
      iss: "someStirng",
      // The "sub" (subject) claim identifies the principal that is the
      //    subject of the JWT.  The claims in a JWT are normally statements
      //    about the subject.  The subject value MUST either be scoped to be
      //    locally unique in the context of the issuer or be globally unique.
      //    The processing of this claim is generally application specific.  The
      //    "sub" value is a case-sensitive string containing a StringOrURI
      //    value.  Use of this claim is OPTIONAL.
      sub: userId,
    },
    process.env.secretOrKey,
    { expiresIn: "1h" }
  );
};

//--------------------------
// SIGN UP
userRouter.post("/register", (req, res) => {
  const { username, password, role } = req.body;
  User.findOne({ username }, (err, user) => {
    if (err) {
      res.status(500).json({ message: { msgBody: "Error!", msgError: true } });
    }
    if (user) {
      res.status(400).json({ message: { msgBody: "Username already exist", msgError: true } });
    } else {
      const newUser = new User({ username, password, role });
      newUser.save((err) => {
        if (err) {
          res.status(500).json({ message: { msgBody: "Error!", msgError: true } });
        } else {
          res.status(201).json({ message: { msgBody: "Account created!", msgError: false } });
        }
      });
    }
  });
});
//---------------------------
//LOGIN
userRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, username, role } = req.user;
    const token = signToken(_id);
    res.cookie("access_token", token, { httpOnly: true, sameSite: true });
    res.status(200).json({ isAuthenticated: true, user: { username, role } });
  }
});
//---------------------------------
//LOGOUT
userRouter.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.clearCookie("access_token");
  res.json({ user: { username: "", role: "" }, success: true });
});
//=======================================
//Create TODO for user
userRouter.post("/todo", passport.authenticate("jwt", { session: false }), (req, res) => {
  const todo = new Todo(req.body);
  todo.save((err) => {
    if (err) {
      res.status(500).json({ message: { msgBody: "Error", msgError: true } });
    } else {
      req.user.todos.push(todo);
      req.user.save((err) => {
        if (err) {
          res.status(500).json({ message: { msgBody: "Error", msgError: true } });
        } else {
          res.status(200).json({ message: { msgBody: "Todo creted!", msgError: false } });
        }
      });
    }
  });
});

module.exports = userRouter;
