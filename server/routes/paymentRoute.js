const { placeOrder } = require("../controllers/orderController");
const {
  initializePayment,
  verifyPayment,
} = require("../controllers/paymentController");

const router = require("express").Router();

// initialize payment
router.post("/transaction-initialize", initializePayment);

// verify payment & place order
router.post("/:ref", verifyPayment, placeOrder);

module.exports = router;
