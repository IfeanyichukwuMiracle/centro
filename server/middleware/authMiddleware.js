const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const authenticate = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")?.[1];
    if (!token) return next(new AppError("Login...", 400, "error"));

    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    if (!id) return next(new AppError("Login...", 400, "error"));

    const user = await User.findById(id);
    if (!user) return next(new AppError("Login...", 400, "error"));

    req.user = user;
    next();
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

const authorize = async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new AppError("You're Not Authorized.", 403, "error"));
  }
  next();
};
module.exports = { authenticate, authorize };
