// include modules
require("dotenv").config();
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const express = require("express");

// set express
const app = express();
const port = process.env.EXPRESS_PORT;

// inclute routers
const userRouter = require("./routers/user");
const authRouter = require("./routers/auth");

// connect to mongoDB
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => console.log("Successfully to connect MongoDB"))
  .catch((err) => {
    console.log("Failed to connect to MongoDB");
    console.log(err);
  });

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
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

// set routers
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log("Server is running on port " + port);
});
