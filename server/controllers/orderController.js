const Order = require("../models/orderModel");
const AppError = require("../utils/AppError");
const Product = require("../models/productModel");
const axios = require("axios");

// create order
const placeOrder = async (req, res, next) => {
  try {
    const products = req.body.products.map((product) => product._id);
    req.body.products.forEach(async (product) => {
      const foundProduct = await Product.findById(product._id);
      if (!foundProduct)
        return next(
          new AppError(
            `Can't place order! Product doesn't exist.`,
            404,
            "error"
          )
        );
      const newQuantity = foundProduct.quantity - product.amount;
      if (newQuantity === 0) {
        foundProduct.deleted = true;
        foundProduct.quantity = newQuantity;
        await foundProduct.save();
        return;
      }
      foundProduct.quantity = newQuantity;
      await foundProduct.save();
    });
    const street_address = `${req.body.street_address1} ${req.body.street_address2}`;
    // place order
    const newOrder = await Order.create({
      products,
      street_address,
      ...req.body,
    });
    return res
      .status(200)
      .json({ status: "success", message: "Order Placement Successful!" });
  } catch (e) {
    console.log(e);
    return next(new AppError("Order placement failed!", 500, "fail"));
  }
};

// remove/fufill order
const fulfillOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) return next(new AppError("Order doesn't exist!", 404, "Error"));

    order.fulfilled = true;
    await order.save();
    // send response
    return res
      .status(200)
      .json({ status: "success", message: "Order fulfilled!" });
  } catch (e) {
    console.log(e);
    return next(new AppError("Order fulfillment failed!", 500, "fail"));
  }
};

// get pending orders
const getPendingOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ fulfilled: false }).populate("products");
    return res.status(200).json({ status: "success", data: orders });
  } catch (e) {
    console.log(e);
    return next(new AppError("orders fetch failed", 500, "fail"));
  }
};

// get fulfilled orders
const getfulfilledOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ fulfilled: true }).populate("products");
    return res.status(200).json({ status: "success", data: orders });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 500, "fail"));
  }
};

module.exports = {
  placeOrder,
  fulfillOrder,
  getPendingOrders,
  getfulfilledOrders,
};
