const router = require("express").Router();
const {
  addProduct,
  findProducts,
  findProduct,
  editProduct,
  deleteProduct,
  findFeaturedProducts,
  latestArrivals,
} = require("../controllers/productController");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

router.get("/", findProducts);

router.get("/featured-products", findFeaturedProducts, findProducts);
router.get("/latest-arrivals", latestArrivals, findProducts);

router.get("/:productId", findProduct);

router.use(authenticate);
router.use(authorize);
router.post("/post", upload.array("files", 12), addProduct);
router.patch("/:productId", upload.array("files", 12), editProduct);
router.patch("/delete/:productId", deleteProduct);

module.exports = router;
