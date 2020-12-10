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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
