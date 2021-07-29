const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // ref is required for making relations with other table/relation
    required: true,
  },
  quantity: {
    type: Number,
    // required: true, // here required and default together doesnot make a sense
    default: 1,
  },
});

module.exports = mongoose.model("Order", orderSchema);
