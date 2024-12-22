const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
  },
  description: {
    type: String,
    required: [true, "description is required"],
  },
  specification: {
    type: String,
    required: [true, "specification is required"],
  },
  category: {
    type: String,
    required: [true, "category is required"],
    enum: {
      values: [
        "phone",
        "laptop",
        "headphone",
        "earpiece",
        "accessories",
        "microphones",
        "tablet",
      ],
      message: "catgory not valid",
    },
    default: "phone",
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  quantity: {
    type: Number,
    required: [true, "quantity is required"],
  },
  image: [String],
  deleted: { type: Boolean, default: false },
});

productSchema.pre(/^find$/i, function (next) {
  this.find({ deleted: false });
  next();
});
// productSchema.pre("find", function (next) {
//   this.find({ deleted: false });
//   next();
// });
// productSchema.pre("findOne", function (next) {
//   this.find({ deleted: false });
//   next();
// });
// productSchema.pre("findOneAndUpdate", function (next) {
//   this.find({ deleted: false });
//   next();
// });
// productSchema.pre("findOneAndReplace", function (next) {
//   this.find({ deleted: false });
//   next();
// });
// productSchema.pre("findOneAndDelete", function (next) {
//   this.find({ deleted: false });
//   next();
// });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
