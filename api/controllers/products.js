const mongoose = require("mongoose");
const Product = require("../models/product");

exports.productsGetAll = (req, res, next) => {
  Product.find()
    .select("_id name price productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc.id,
            },
          };
        }),
      };
      console.log(docs);
      // if (docs.length > 0) {  //this check need not be done
      res.status(200).json(response);
      // } else {
      // res.status(404).json({
      // message: "No entries found",
      // });
      // }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.productsCreateProduct = (req, res, next) => {
  console.log(req.file);

  // const product = {
  //   name: req.body.name,
  //   price: req.body.price,
  // };

  // Create product instance using Product model
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });

  //save() is a method provided by mongoose which we can use on mongoose models to store data in database
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Product created successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          productImage: result.productImage,
          _id: result._id,
          request: {
            type: "GET",
            url: "http://localhost:3000/products/" + result.id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.productGetSingleProduct = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          message: "Product fetched successfully",
          product: doc,
          request: {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        });
        //response is sent here because this is asynchronous, data fetching takes time
        // and we need to send response after getting the data.
        // if we don't send response inside then() or catch() block
        // then response will not wait to fetch the data.
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
};

exports.productUpdateProduct = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update(
    { _id: id },
    {
      $set: updateOps,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Product updated",
        request: {
          type: "GET",
          description: "Get the product you just updated",
          url: "http://localhost:3000/products/" + id,
        },
      });
    })
    .catch((err) => {
      console.log(error);
      res.status(500).json({ error: err });
    });
};

exports.productDeleteProduct=(req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Product deleted",
        request: [
          {
            type: "POST",
            description: "Add new product",
            url: "http://localhost:3000/products",
            body: { name: "String", price: "Number" },
          },
          {
            type: "GET",
            description: "Get all products",
            url: "http://localhost:3000/products",
          },
        ],
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
}
