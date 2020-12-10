const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const User = require("./models/User");

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["access_token"];
  }
  return token;
};
//----------------------------
// console.log(process.env.secretOrKey);
//---------------------------
//Authorization to protect endpoints
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: process.env.secretOrKey,
    },
    (payload, done) => {
      User.findById({ _id: payload.sub }, (err, user) => {
        if (err) {
          return done(err, false);
        }

        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    }
  )
);

//---------------------
//LOGIN
//authenticated local strategy using username and password
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      //smthg went wrong with DB
      if (err) {
        return done(err);
      }
      //no user exist
      if (!user) {
        return done(null, false);
      }
      //if OK check if password is correct
      user.comparePassword(password, done);
    }); //jwt.io
  })
);
