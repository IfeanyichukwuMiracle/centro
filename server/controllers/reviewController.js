const Review = require("../models/reviewModel");
const AppError = require("../utils/AppError");

// add review
const addReview = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const review = await Review.create({
      review: req.body.review,
      product: productId,
      user: req.user._id,
    });

    // send response
    return res.status(200).json({ status: "success", data: review });
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

// view review
const findReviews = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const reviews = await Review.find({ product: productId }).populate("user");

    // send response
    return res
      .status(200)
      .json({ status: "success", results: reviews.length, data: reviews });
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

module.exports = { addReview, findReviews };
