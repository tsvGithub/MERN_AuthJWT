const mongoose = require("mongoose");
//to hash a password (encrypt it) to protect password in DB from hackers
const bcrypt = require("bcrypt");
// (2)
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 15,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    //role => user or admin
    enum: ["user", "admin"],
    required: true,
  },
  todos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Todo" }],
});

//(2a)
//=====================================================
//bcrypt
//mongoose pre-hook => code execute right before save
//to hash the password before save it in DB
UserSchema.pre("save", function (next) {
  //When the save function is called, we will first check to see if the user is being created or changed.
  //If the user is not being created or changed, we will skip over the hashing part.
  //We don’t want to hash our already hashed data.
  //does password need to hash?
  //if password already hashed:
  if (!this.isModified("password")) {
    //if it isn't true => call func 'next'
    //!this.isModified === not modified
    return next();
  }
  //------------------------------------
  //if a password didn't hash:
  // hashing password: 1) password 2) saltround
  //3)callback with err & get back the hashed password
  bcrypt.hash(this.password, 10, (err, passwordHash) => {
    if (err) {
      return next(err);
    }
    //if OK =>
    //overide existing password and set it
    //to password hash
    this.password = passwordHash;
    //then call next
    next();
  });
});

//(2b)
//COMPARE PASSWORD
//+++passport.js LocalStrategy (3a)
//compare plain text version from client to hashed
//version within DB
//passwod in plain text, call-back
UserSchema.methods.comparePassword = function (password, cb) {
  //1)passport from the client he's trying to sign in;
  //2)hashed password
  //3)cb with error & isMatch(true/false)
  //callback function that returns the true/false result of whether or not the two matched.
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) {
      //return cb with the error
      return cb(err);
    } else {
      //if it isn't match
      //if isMatch === false
      if (!isMatch) {
        console.log("Password doesn't match!");
        //return cb with null for error object &
        //isMatch === false
        console.log(isMatch);
        return cb(null, isMatch);
      }
      //if isMatch === true
      console.log("Password matches!");
      //return cb with null for error object &
      //this===user object for (4b) req.user
      console.log(this);
      return cb(null, this);
    }
  });
};

module.exports = mongoose.model("User", UserSchema);
