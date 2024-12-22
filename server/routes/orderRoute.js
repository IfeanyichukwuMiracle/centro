const router = require("express").Router();
const {
  getfulfilledOrders,
  fulfillOrder,
  getPendingOrders,
} = require("../controllers/orderController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

router.use(authenticate);
router.use(authorize);
// fulfill order/delete order
router.patch("/:orderId", fulfillOrder);
router.get("/pending", getPendingOrders);
router.get("/fulfilled", getfulfilledOrders);

module.exports = router;
