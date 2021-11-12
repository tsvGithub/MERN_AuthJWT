const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const PORT = 8080;

//NB!
//try this:
//Since version 1.5.0, the cookie-parser middleware no longer needs to be used for this module to work.
//https://www.npmjs.com/package/express-session
app.use(cookieParser());
//------------------------------
app.use(express.json());

dotenv.config();
// console.log(process.env.DATABASEURL);
//===================================
const DATABASEURL = process.env.DATABASEURL;
// console.log(DATABASEURL);

mongoose.connect(
  DATABASEURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to DB");
  }
);
//---------------------
// 4 Setting up Express Routes
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
//Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
