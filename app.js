// include modules
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");

const express = require("express");
const app = express();
const port = process.env.EXPRESS_PORT;

// include controllers
const userController = require("./controllers/userController");
const googleController = require("./controllers/googleController");
const { login_correct } = require("./controllers/googleController");

// connect to mongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Successfully to connect MongoDB"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.errorMessage = req.flash("errorMessage");
  res.locals.user = req.session.user;
  next();
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/login", userController.login);
app.post("/login", userController.handleLogin);
app.get("/register", userController.register);
app.post("/register", userController.handleRegister);
app.get("/logout", userController.logout);
app.get("/auth/google", googleController.login);
app.get("/auth/google/redirect", googleController.callback);
app.get("/auth/google/success", googleController.success);
app.get("/auth/google/failure", googleController.fail);

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
