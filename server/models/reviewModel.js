const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review is required"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
