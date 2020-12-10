const express = require("express");
const userRouter = express.Router();
const passport = require("passport");
const passportConfig = require("../passport");
const JWT = require("jsonwebtoken");
const User = require("../models/User");
const Todo = require("../models/Todo");

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

module.exports = userRouter;
