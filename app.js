const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const app = express();
const passport = require("passport");
app.use(passport.initialize());


app.use(cors());
app.use(express.json());

//NB!
//try this:
//Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work.
//https://www.npmjs.com/package/express-session
app.use(cookieParser());

//------------------------------

dotenv.config();
// console.log(process.env.DATABASEURL);

//===================================
//DB (1)
const DBURL = process.env.Atlas_URI;
// const DBURL = process.env.DATABASEURL;
// console.log(DATABASEURL);
let db = DBURL === process.env.Atlas_URI ? "DB Atlass" : "Local DB";
mongoose
  .connect(DBURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log(`${db} connected`);
  })
  .catch((err) => {
    console.log(`Can't connect to ${db}`, err.message);
  });
//---------------------

// 4 Setting up Express Routes
// app.use(passport.initialize());
//require UserRouter from routes/User
const userRouter = require("./routes/User");
//endpoint is '/user'
app.use("/user", userRouter);
//----------------------------------
// const User = require("./models/User");
// // test;
// const userInput = {
//   username: "zhurka",
//   password: "password",
//   role: "admin",
// };

// const user = new User(userInput);
// user.save((err, document) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log(document);
// });

//----------------------------------
//Server (2)
const PORT = process.env.PORT || 8080;
// console.log(PORT);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
