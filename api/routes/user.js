const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");
const checkAuth=require('../middleware/check-auth');

router.post("/signup", userController.userSignup);

router.post("/login", userController.userLogin);

// DELETE route
router.delete("/:userId",checkAuth, userController.userDelete);

module.exports = router;
