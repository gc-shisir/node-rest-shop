const express = require("express");
const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");
const userRoutes = require("./api/routes/user");

mongoose.connect("mongodb://localhost:27017/node_rest_api_shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(morgan("dev"));

app.use("/uploads", express.static("uploads"));

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handling CORS
app.use((req, res, next) => {
  // now we add some header to the response. this will not send response, it will just adjust it
  // so that wherever we send response, it has these headers.
  // res.header("Access-Control-Allow-Origin", "http://my-cool-page.com"); restrict response to particular site
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    // define which kind of headers we want to accept. we can set its value to * or specify different
    // values as mentioned below
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With, Content-Type, Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    // Here we specify all the http request methods we want to support with our api
    res.header("Access-Control-Allow-Methods", "PUT,PATCH,POST,DELETE, GET");
    // if we have OPTIONS request, we already want to return response status 200
    // with json data or payload that is empty
    return res.json({});
  }
  // We added cors error handling but right now, we would always block our incoming requests.
  //  We also need to call next() at the end of our middleware if we are not returning immediately due to  OPTIONS request
  //  so that the other routes can take over or execute.
  next();
});

// routes which should handle requests
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/user", userRoutes);

app.use("", (req, res, next) => {
  const error = new Error("Not found");
  error.status = 404; //404: didn't find fitting route
  next(error); //forward the error request
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;

// completed video 13
// error: upload image in add product
