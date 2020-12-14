const express = require("express");
const router = express.Router();

const user_controller = require("../controllers/userController");

/* GET request for user signup */
router.get("/", user_controller.user_signup_get);

/* POST request for user signup */
router.post("/", user_controller.user_signup_post);

module.exports = router;
