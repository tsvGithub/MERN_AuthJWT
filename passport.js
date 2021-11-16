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
//when user is authenticated we set a cookie on
//the client browser and this cookie is the JWT
//token.
//Func cookieExtractor extracts JWT token
//from the request.
//secretOrKey will be used to verify that
//this token from cookieExtractor is legitimate
const cookieExtractor = (req) => {
  //
  let token = null;
  //if there is req object & req.cookies not empty
  if (req && req.cookies) {
    //set token to jsw token
    token = req.cookies["access_token"];
  }
  return token;
};

//3b AUTHORIZATION (to protect endpoints) +++ (4c) Logout
passport.use(
  //jwt strategy with options object
  new JwtStrategy(
    //options object:
    //1)jwtFromRequest is the func (3ba) cookieExtractor
    //2)second option secretOrKey is the key that
    //we use to sign to token
    //secretOrKey will be used to verify that
    //this token from cookieExtractor is legitimate

    //secretOrKey is used to verify that the JWT token is valid.
    //So we signed our JWT token with "process.env.secretOrKey".
    //So we need to verify using the same key.
    //Also the key shouldn't be that simple.
    {
      jwtFromRequest: cookieExtractor,
      //----------------------------
      // console.log(process.env.secretOrKey);
      //---------------------------
      //matches (4ba) routes->User.js  process.env.secretOrKey,
      //passport will be use this secretOrKey to verify
      //that this token is legitimate
      secretOrKey: process.env.secretOrKey,
    },
    //a verified callback:
    //payload === data we set whithin JWT token
    // & func done
    (payload, done) => {
      //if user exist
      // _id => search by primary key in DB;
      //claim is a subject and that subject
      //is primary key of that user.
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
          //return 'done' func with Err
          //and user didn't find === false
          return done(err, false);
        }
        //if user exist
        if (user) {
          //return func 'done' with err===null
          //and user object
          //because user is already authenticated
          //we don't need to check password to comapre
          return done(null, user);
        } else {
          //if not user (that has a primary key)
          //return func done with err===null, user===false
          return done(null, false);
        }
      });
    }
  )
);

//---------------------
//LOGIN => AUTHENTICATION
//3a USE PASSPORT
//***used in  routes->User.js login (4a)***
//authenticated local strategy using username and password
passport.use(
  //LocalStr. with verified cb: username,password & done
  //doen will be invoked when we are done
  new LocalStrategy((username, password, done) => {
    //to authenticate agianst the DB
    //check if user exist => find username
    //and cb
    User.findOne({ username }, (err, user) => {
      //smthng went wrong with DB
      if (err) {
        return done(err);
      }
      //no user exists
      if (!user) {
        //invoke done function with no err (null) &
        //did not find a user(false)
        return done(null, false);
      }
      //if OK: =>
      //user for (4b) const { _id, username, role } = req.user;
      //comparePassword (2b)
      //check compare if password is correct
      //ComparePassword comes from User.js model
      //we pass in ComparePassword func in Model 'password"
      // and cb===done
      user.comparePassword(password, done);
    }); //jwt.io
  })
);
