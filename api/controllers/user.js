const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.userSignup = (req, res, next) => {
  // Check whether email is unique or not.
  // we can also check uniqueness by providing unique property to model, but it will not validate.
  User.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      // STATUS:409=>conflict
      return res.status(409).json({
        message: "Email already exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          // only execute this if the email is not already registered
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          user
            .save()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: "User created",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    }
  });
};
exports.userSignup = (req, res, next) => {
  // Check whether email is unique or not.
  // we can also check uniqueness by providing unique property to model, but it will not validate.
  User.find({ email: req.body.email }).then((user) => {
    if (user.length >= 1) {
      // STATUS:409=>conflict
      return res.status(409).json({
        message: "Email already exists",
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err,
          });
        } else {
          // only execute this if the email is not already registered
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
          });
          user
            .save()
            .then((result) => {
              console.log(result);
              res.status(201).json({
                message: "User created",
              });
            })
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: err,
              });
            });
        }
      });
    }
  });
};

exports.userLogin = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          // 401=> Unauthorized
          message: "Auth Failed",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id,
            },
            "secret", // use environment variable for this secret key. better choose complex secret key
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Successful",
            token: token,
          });
        }
        res.status(401).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        err: error,
      });
    });
};

exports.userDelete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User deleted",
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};
