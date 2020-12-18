const { body, validationResult } = require("express-validator");

const Message = require("../models/message");

exports.get_messages = (req, res, next) => {
  // Retrieve all messages from database
  Message.find({}).exec(function (err, messages) {
    if (err) {
      return next(err);
    }

    res.render("index", {
      messages: messages,
    });
  });
};

exports.create_message_get = (req, res) => {
  res.render("message_form");
};

exports.create_message_post = [
  // Validate and sanitize user input
  body("title", "The title exceeds the maximum character limit of 50")
    .trim()
    .isLength({ max: 50 })
    .bail()
    .escape(),
  body(
    "message_body",
    "The message body exceeds the maximum character limit of 1000"
  )
    .isLength({ max: 1000 })
    .bail()
    .escape(),

  // Process the request after validation/sanitation
  (req, res, next) => {
    const errors = validationResult(req);

    const newMessage = new Message({
      author_id: req.user._id,
      author_username: req.user.username,
      title: req.body.title,
      body: req.body.message_body,
    });

    if (!errors.isEmpty()) {
      res.render("message_form", {
        data: newMessage,
        errors: errors.array(),
      });
    } else {
      newMessage.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];

exports.delete_message_get = (req, res, next) => {
  Message.findById(req.params.id).exec(function (err, message) {
    if (err) {
      return next(err);
    }
    res.render("message_delete", {
      message: message,
    });
  });
};

exports.delete_message_post = (req, res, next) => {
  Message.findByIdAndDelete(req.body.message_id, function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
