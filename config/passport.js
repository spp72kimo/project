require("dotenv").config();
const User = require("../models/userAuth");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://steven.idv.tw/auth/google/redirect",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ googleID: profile.id })
        .then((results) => {
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
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://steven.idv.tw/auth/facebook/redirect",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOne({ faecbookID: profile.id })
        .then((results) => {
          if (results) {
            return cb(null, results);
          }

          new User({
            username: profile.displayName,
            facebookID: profile.id,
          })
            .save()
            .then((newUser) => {
              return cb(null, newUser);
            })
            .catch((err) => {
              return cb(err);
            });
        })
        .catch((err) => {
          return cb(err);
        });
    }
  )
);

passport.serializeUser(function (user, done) {
  let authID = {
    googleID: user.googleID,
    facebookID: user.facebookID,
  };
  done(null, authID);
});

passport.deserializeUser(function (authID, done) {
  if (authID.googleID) {
    User.findOne({ googleID: authID.googleID })
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  }
  if (authID.facebookID) {
    User.findOne({ facebookID: authID.facebookID })
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  }
});
