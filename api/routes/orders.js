const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const ordersController = require("../controllers/orders");

// GET request
router.get("/", checkAuth, ordersController.ordersGetAll);

// POST request
router.post("/", checkAuth, ordersController.ordersCreateOrder);

// GET single order
router.get("/:orderId", checkAuth, ordersController.ordersGetSingleOrder);

// DELETE request
router.delete("/:orderId", checkAuth, ordersController.ordersDeleteOrder);

module.exports = router;
