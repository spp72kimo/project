require("dotenv").config();
const User = require("../models/userGoogle");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/redirect",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleID: profile.id }).then((results) => {
        if (results) {
          return cb(null, results);
        }

        new User({
          username: profile.displayName,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
        })
          .save()
          .then((newUser) => {
            return cb(null, newUser);
          })
          .catch((err) => {
            return cb(err);
          });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.googleID);
});

passport.deserializeUser(function (googleID, done) {
  User.findOne({ googleID }).then((user) => {
    done(null, user);
  });
});
