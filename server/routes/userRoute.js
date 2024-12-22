const { signup, login, getUser } = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const router = require("express").Router();

// signup
router.post("/signup", signup);
// login
router.post("/login", login);

// get user
router.use(authenticate);
router.get("/", getUser);

module.exports = router;
