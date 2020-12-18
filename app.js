const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const dotenv = require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

const User = require("./models/user");

// Connect to database
const mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Mongo connection error"));

// Configure local strategy for use by Passport
passport.use(
  new LocalStrategy((username, password, done) => {
    User.findOne({ username: username }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "Invalid username or password" });
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (err) {
          return done(err);
        }
        if (res) {
          // Passwords match
          return done(null, user);
        } else {
          // Passwords do not match
          return done(null, false, {
            message: "Invalid username or password",
          });
        }
      });
    });
  })
);

// Configure passport authenticated session persistence
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// Configure express application
const app = express();

// Configure view engine to render Pug templates
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Express application middlewares
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
  res.locals.title = "Member Board";
  res.locals.user = req.user;
  next();
});

// Configure routes for the application
const indexRouter = require("./routes/index");
const signUpRouter = require("./routes/signup");
const loginRouter = require("./routes/login");
const messagesRouter = require("./routes/messages");

// Application routes
app.use("/", indexRouter);
app.use("/sign-up", signUpRouter);
app.use("/login", loginRouter);
app.use("/messages", messagesRouter);

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
