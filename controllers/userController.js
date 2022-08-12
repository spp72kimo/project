const bcrypt = require("bcrypt");
const db = require("../models");
const User = db.User;
const saltRounds = 10;

module.exports = {
  login: (req, res) => {
    res.render("login");
  },

  handleLogin: (req, res, next) => {
    const { email, password } = req.body;
    User.findOne({
      where: {
        email,
      },
    }).then((user) => {
      if (user === null) {
        req.flash("errorMessage", "帳號密碼錯誤！");
        return res.redirect("/user/login");
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
          };
          return res.redirect("/");
        } else {
          req.flash("errorMessage", "帳號密碼錯誤！");
          res.redirect("/user/login");
        }
      });
    });
  },

  register: (req, res) => {
    res.render("register");
  },

  handleRegister: (req, res) => {
    const { username, email, password } = req.body;
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err.toString());
        req.flach("errorMessage", "hash error occured.");
        return res.redirect("/user/register");
      }

      User.create({
        username,
        email,
        password: hash,
      })
        .then((user) => {
          req.session.user = {
            id: user.id,
            username: user.username,
            email: user.email,
          };
          res.redirect("/");
        })
        .catch((err) => {
          if (err.toString().includes("SequelizeUnique")) {
            req.flash("errorMessage", "E-mail 已被註冊！");
            return res.redirect("/user/register");
          }

          req.flash("errorMessage", err.toString());
          return res.redirect("/user/register");
        });
    });
  },

  logout: (req, res) => {
    req.session.destroy();
    req.logout(() => {
      res.redirect("/");
    });
  },
};
