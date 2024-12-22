const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      },
    ],
    email: {
      type: String,
      required: [true, "email is required"],
    },
    street_address: {
      type: String,
      required: [true, "billing address is required"],
    },
    town: {
      type: String,
      required: [true, "city is required"],
    },
    country: {
      type: String,
      required: [true, "country is required"],
    },
    state: {
      type: String,
      required: [true, "state is required"],
    },
    firstname: {
      type: String,
      required: [true, "firstname is required"],
    },
    lastname: {
      type: String,
      required: [true, "lastname is required"],
    },
    phone: {
      type: String,
      required: [true, "phone no is required"],
    },
    company_name: {
      type: String,
      required: [true, "company name is required"],
      default: this.firstname,
    },
    fulfilled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
