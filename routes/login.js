const express = require("express");
const router = express.Router();
const passport = require("passport");

const user_controller = require("../controllers/userController");

/* GET request for user login */
router.get("/", user_controller.user_login_get);

/* POSt request for user login */
router.post(
  "/",
  user_controller.user_login_post,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", `Welcome back ${req.user.first_name}`);
    return res.redirect("/");
  }
);

module.exports = router;
