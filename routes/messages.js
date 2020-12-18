const express = require("express");
const router = express.Router();

const message_controller = require("../controllers/messageController");

/* GET request for message creation form */
router.get("/create", message_controller.create_message_get);

/* POST request for message creation */
router.post("/create", message_controller.create_message_post);

router.get("/:id/delete", message_controller.delete_message_get);

router.post("/:id/delete", message_controller.delete_message_post);

module.exports = router;
