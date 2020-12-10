const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const PORT = 5000;

app.use(cookieParser());
app.use(express.json());

mongoose.connect(
  "mongodb://localhost:27017/mernauth",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected to DB");
  }
);
//----------------------------------
const User = require("./models/User");
//test
// const userInput = {
//   username: "tsv",
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
