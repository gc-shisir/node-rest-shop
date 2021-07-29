const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { restart } = require("nodemon");

const Order = require("../models/order");
const Product = require("../models/product");

// GET request
router.get("/", (req, res, next) => {
  Order.find()
    .select("product quantity _id")
    .populate("product", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// POST request : note:::POST block below is more descriptive/appropriate but with deep nesting
router.post("/", (req, res, next) => {
  //check if we have products for a given id
  Product.findById(req.body.productId)
    .then((product) => {
      // if no product returned i.e. null
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Order stored",
        createdOrder: {
          _id: result.id,
          product: result.product,
          quantity: result.quantity,
        },
        request: {
          type: "GET",
          url: "http://localhost/orders/" + result.id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });

  // Following catch block is commented out because it the code block will not reach this catch block
  //  in this then() catch() blocks arrangement. it is done because there was extreme nesting.
  // .catch((err) => {
  //   res.status(500).json({
  //     message: "Product not found",
  //     error: err,
  //   });
  // });
});

// Following POST REQUEST can be used. Both above POST and this are same
router.post("/", (req, res, next) => {
  //check if we have products for a given id
  Product.findById(req.body.productId)
    .then((product) => {
      // if no product returned i.e. null
      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId,
      });
      order
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Order stored",
            createdOrder: {
              _id: result.id,
              product: result.product,
              quantity: result.quantity,
            },
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + result.id,
            },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Product not found",
        error: err,
      });
    });
});

// GET single order
router.get("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .exec()
    .then((order) => {
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      res.status(200).json({
        order: order,
        request: {
          method: "GET",
          url: "http://localhost:3000/orders",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// DELETE request
router.delete("/:orderId", (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Order deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/orders/",
          body: {
            productID: "ID",
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
