const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// signup
const signup = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;
  if (firstname && lastname && email && password) {
    // hash password
    bcrypt.hash(password, 8, async (err, hash) => {
      if (err) return next(new AppError(err.message, 500, "error"));

      try {
        // create new user
        const newUser = await User.create({ ...req.body, password: hash });
        // create token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES,
        });
        // send response
        return res.status(200).json({ status: "success", token });
      } catch (e) {
        return next(new AppError(e.message, 500, "fail"));
      }
    });
    return;
  }

  return next(new AppError("fields must be filled...", 400, "error"));
};

// login
const login = async (req, res, next) => {
  try {
    // find user
    const user = await User.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!user)
      return next(new AppError("incorrect email or password...", 404, "error"));
    // check password validity
    bcrypt.compare(req.body.password, user.password, async (err, isPwd) => {
      if (err)
        return next(new AppError("incorrect email or password", 400, "error"));
      if (!isPwd)
        return next(new AppError("incorrect email or password", 400, "error"));
      // create token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES,
      });

      if (user.role == "admin") {
        // send response
        return res
          .status(200)
          .json({ status: "success", token, role: user.role });
      }
      return res.status(200).json({ status: "success", token });
    });
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

// get user
const getUser = async (req, res, next) => {
  const { role, password, ...rest } = req.user._doc;
  return res.status(200).json({ status: "success", data: rest });
};

module.exports = { signup, login, getUser };
