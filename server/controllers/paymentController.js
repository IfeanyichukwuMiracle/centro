const https = require("https");
const AppError = require("../utils/AppError");
const axios = require("axios");

const initializePayment = async (req, res, next) => {
  try {
    const response = await axios.post(
      `https://api.paystack.co:443/transaction/initialize`,
      {
        email: req.body.email,
        amount: req.body.amount * 100,
        callback_url: `${process.env.CLIENT_URI}checkout`,
        metadata: {
          cancel_action: `${process.env.CLIENT_URI}cart`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    return res.status(200).json({ status: "success", data: response.data });
  } catch (error) {
    console.log(error);
    return next(
      new AppError(
        "Failed to process payment. Check your connection an try again!",
        500,
        "fail"
      )
    );
  }
};

const verifyPayment = async (req, res, next) => {
  try {
    const response = await axios.get(
      `https://api.paystack.co:443/transaction/verify/${req.params.ref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    if (response.data.data.status === process.env.TRANSACTION_RESPONSE) {
      return next();
    }
    return next(new AppError("Transaction failed!", 500, "fail"));
  } catch (err) {
    console.log(err);
    return next(new AppError(`Transaction verification failed!`, 500, "fail"));
  }
};

module.exports = { initializePayment, verifyPayment };
