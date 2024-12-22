require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 9000;
const AppError = require("./utils/AppError");
const cors = require("cors");

// routes
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const reviewRoutes = require("./routes/reviewRoute");
const orderRoutes = require("./routes/orderRoute");
const paymentRoutes = require("./routes/paymentRoute");

// start server
startServer(process.env.MONGO_URI, PORT);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// routes middware
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/review", reviewRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/pay", paymentRoutes);

app.all("*", (req, res, next) => {
  return next(new AppError("route doesn't exist", 404, "error"));
});

// error handling middleware
app.use((err, req, res, next) => {
  return res.status(err.code).json({ status: err.type, message: err.message });
});

async function startServer(uri, port) {
  try {
    // connect to db
    await mongoose.connect(uri);
    console.log(`DB connected...`);
    // start server
    app.listen(port, () => console.log(`server started on port ${port}...`));
  } catch (e) {
    console.log(e);
    return;
  }
}
