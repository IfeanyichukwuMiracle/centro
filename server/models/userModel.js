const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "firstname is required..."],
  },
  lastname: {
    type: String,
    required: [true, "lastname is required..."],
  },
  email: {
    type: String,
    required: [true, "email is required..."],
    unique: [true, "email exists already..."],
    validate: {
      validator: function (e) {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(e);
      },
      message: `email not valid`,
    },
  },
  password: {
    type: String,
    required: [true, "password is required..."],
    minlength: [8, "password must be above 8 characters"],
    select: false,
  },
  role: {
    type: String,
    enum: {
      values: ["user", "admin"],
      message: "role doesn't exist",
    },
    default: "user",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
