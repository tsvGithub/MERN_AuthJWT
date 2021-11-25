// 3 passport is authentication middleware
const passport = require("passport");
//Passport strategy for authenticating with a username and password
//LocalStrategy is how we are going to be authenticating against a DB (username & password)
const LocalStrategy = require("passport-local").Strategy;
//User model : username & password
const User = require("./models/User");
//-----------------------------
// jwt.io
//A Passport strategy for authorization with a JSON Web Token.
const JwtStrategy = require("passport-jwt").Strategy;

//=============================================
//3ba
//When 'user' is authenticated (logged in) we set a cookie on
//the client browser and this cookie is the JWT token.
//'cookieExtractor' extracts JWT token from the request ('req').

//a)The client requests authorization to the authorization server.
//b)When the authorization is granted, the authorization server
//returns an access token to the application.
//c)The application uses the access token to access a protected resource.
const cookieExtractor = (req) => {
  // extracted token:
  let token = null;
  //if there is req object & req.cookies not empty
  if (req && req.cookies) {
    //set extracted token to jwt access token from authorization server
    token = req.cookies["access_token"];
  }
  //return 'null' or 'access token'
  return token;
};

//3b AUTHORIZATION (to protect endpoints) +++ (4c) Logout
passport.use(
  //jwt strategy with options object
  new JwtStrategy(
    //1)first option 'jwtFromRequest' is the func (3ba) 'cookieExtractor'
    //2)second option 'secretOrKey' is a secret key that we use to sign to token.
    //'secretOrKey' is used to verify that the JWT token (from 'cookieExtractor') is valid.

    //So we signed our JWT token with "process.env.secretOrKey".
    //So we need to verify using the same 'key'.
    //Also the 'key' shouldn't be that simple.
    {
      jwtFromRequest: cookieExtractor,
      //----------------------------
      //matches (4ba) routes->User.js  process.env.secretOrKey,
      //passport uses 'secretOrKey' to verify hat this token is legitimate (valid)
      secretOrKey: process.env.secretOrKey,
      // console.log(process.env.secretOrKey);
    },
    //a verified callback:
    //'payload' === data we set whithin JWT token
    // & func 'done'
    (payload, done) => {
      //if user exists: find 'user'
      // _id => search by primary key in DB;
      //JWT has 'claim' called 'subject'('sub') and
      //it is a 'primary key'('_id') of 'user'.
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
          //return 'done' func with Err
          //and user didn't find === false
          return done(err, false);
        }
        //if user exists
        if (user) {
          //return func 'done' with err===null
          //and 'user' object
          //because 'user' is already authenticated (signed in)
          //we don't need to check password to comapre
          return done(null, user);
        } else {
          //if not user (that has a primary key===_id)
          //return func done with err===null, user===false
          return done(null, false);
        }
      });
    }
  )
);

//---------------------
//LOG IN => AUTHENTICATION
//3a USE PASSPORT
//***used in  routes->User.js login (4a)***
//authenticated local strategy using username and password
passport.use(
  //LocalStr. with verified cb: username,password & done
  //'done' will be invoked when we are done
  new LocalStrategy((username, password, done) => {
    //authenticates agianst the DB
    //check if user exist => find username
    //and cb
    User.findOne({ username }, (err, user) => {
      //smthng went wrong with DB
      if (err) {
        return done(err);
      }
      //if no user exists (account is not exist)
      if (!user) {
        //invoke 'done' function with no err (null) &
        //did not find a user(false)
        return done(null, false);
      }
      //if OK & 'user' exists: => check if password is correct:
      //'user' for (4b) const { _id, username, role } = req.user;

      //'comparePassword' (comes from 2b> models/User.js
      //'comparePassword' accepts password from the client &
      //'cb' is a 'done' function)
      //'comparePassword' compares password from the client to the hashed password
      user.comparePassword(password, done);
    }); //jwt.io
  })
);
