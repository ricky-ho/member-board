const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.user_signup_get = (req, res) => {
  if (!req.user) {
    res.render("signup_form");
  } else {
    res.redirect("/");
  }
};

exports.user_signup_post = [
  // Validate and sanitize user input
  body("first_name")
    .trim()
    .isAlpha()
    .withMessage("The first name field must only contain alphabetic characters")
    .bail()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("last_name")
    .trim()
    .isAlpha()
    .withMessage("The last name field must only contain alphabetic characters")
    .bail()
    .isLength({ min: 1, max: 50 })
    .escape(),
  body("username", "Please enter a valid email address")
    .isEmail()
    .bail()
    .custom((value, { req }) => {
      // Check for duplicate username
      return User.findOne({ username: req.body.username }).then((user) => {
        if (user) {
          return Promise.reject();
        }
      });
    })
    .withMessage("This email is already in use. Please use a different email"),
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("The password must be between 8-20 characters long"),
  body("confirm_password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage(
      "The confirm password field must match the password. Please try again"
    ),

  // Process the request after validation/sanitation
  (req, res, next) => {
    const errors = validationResult(req);

    const newUser = new User({
      first_name: req.body.first_name.toUpperCase(),
      last_name: req.body.last_name.toUpperCase(),
      username: req.body.username,
    });

    if (!errors.isEmpty()) {
      // If there are errors in the user input, re-render the form with error messages
      res.render("signup_form", {
        data: newUser,
        errors: errors.array(),
      });
      return;
    } else {
      // No errors. Create salt and hash the user password and store in our database
      bcrypt.genSalt(10, function (err, salt) {
        if (err) {
          return next(err);
        }
        bcrypt.hash(req.body.password, salt, function (err, hashedPassword) {
          if (err) {
            return next(err);
          }
          newUser.password = hashedPassword;
          newUser.save(function (err) {
            if (err) {
              return next(err);
            }
            next();
          });
        });
      });
    }
  },
];

exports.user_login_get = (req, res) => {
  if (!req.user) {
    req.flash("error", "");
    res.render("login_form");
  } else {
    res.redirect("/");
  }
};

exports.user_login_post = [
  // Validate and sanitize user input
  body("username", "Please enter a valid email address").isEmail(),
  body("password").exists(),

  // Process the request after validation/sanitation
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are errors, re-render the login form with the first error message
      req.flash("error", errors.array()[0].msg);
      return res.redirect("/login");
    }
    next();
  },
];
