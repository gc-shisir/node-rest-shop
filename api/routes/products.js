const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const productsController = require("../controllers/products");

// Multer
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    // accept ans store a file
    cb(null, true);
  } else {
    // reject a file
    cb(null, false);
    // instead of null you can send an  error as " new Error('message') "
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, //accept only upto 5 megabytes
  },
  fileFilter: fileFilter,
});

router.get("/", productsController.productsGetAll);

router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  productsController.productsCreateProduct
);

router.get("/:productId", productsController.productGetSingleProduct);

router.patch("/:productId", checkAuth, productsController.productUpdateProduct);

router.delete(
  "/:productId",
  checkAuth,
  productsController.productDeleteProduct
);

module.exports = router;
