require("../config/passport");
const passport = require("passport");

module.exports = {
  login: passport.authenticate("google", { scope: ["profile"] }),

  callback: passport.authenticate("google", {
    successRedirect: "/auth/google/success",
    failureRedirect: "/auth/google/failure",
  }),

  success: (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  },

  fail: (req, res) => {
    req.flash("errorMessage", "授權錯誤！");
    req.redirect("/");
  },
};
