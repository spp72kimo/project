require("../config/passport");
const passport = require("passport");

module.exports = {
  login: passport.authenticate("facebook"),

  callback: {
    fail: passport.authenticate("facebook", {
      failureRedirect: "/auth/facebook",
    }),

    success: (req, res) => {
      req.session.user = req.user;
      res.redirect("/");
    },
  },
};
