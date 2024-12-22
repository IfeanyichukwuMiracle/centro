const { addReview, findReviews } = require("../controllers/reviewController");
const { authenticate } = require("../middleware/authMiddleware");

const router = require("express").Router();

// get reviews
router.get("/:productId", findReviews);

router.use(authenticate);
// send review
router.post("/:productId", addReview);

module.exports = router;
