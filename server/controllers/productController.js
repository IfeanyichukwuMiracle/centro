const Product = require("../models/productModel");
const AppError = require("../utils/AppError");
const Order = require("../models/orderModel");

// cloudinary
const cloudinary = require("cloudinary").v2;

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImages = async function (arr, next, res, product, type) {
  // images array
  const imgs = [];
  // upload each image to cloudinary
  arr.forEach((img) => {
    cloudinary.uploader.upload(img.path, async (error, result) => {
      // for upload errors
      if (error) {
        console.log(error);
        return next(new AppError("Upload error. Try again!", 500, "fail"));
      }
      // in absence of upload errors
      else {
        // push image url to array
        imgs.push(result.secure_url);
        // when complete create product and send response
        if (imgs.length === arr.length) {
          if (type === "add") {
            try {
              const newProduct = await Product.create({
                ...product,
                image: imgs,
              });
              return res
                .status(200)
                .json({ status: "success", data: newProduct });
            } catch (e) {
              console.log(e.message);
              return next(new AppError(e.message, 500, "Error"));
            }
          } else {
            product.image = imgs;
            await product.save();
            // send response
            return res.status(200).json({ status: "success", data: product });
          }
        }
      }
    });
  });
};

// add product
const addProduct = async (req, res, next) => {
  try {
    // arrange product
    const product = {
      ...req.body,
      price: req.body?.price && +req.body.price,
      quantity: req.body?.quantity && +req.body.quantity,
    };

    // upload images
    await uploadImages(req.files, next, res, product, "add");
    return;
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 500, "error"));
  }
};

// edit product
const editProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) return next(new AppError("Not found", 404, "fail"));

    if (req.body?.price) {
      product.price = +req.body.price;
    }
    if (req.body?.quantity) {
      product.quantity = +req.body.quantity;
    }
    if (req.body?.description) {
      product.description = req.body.description;
    }
    if (req.body?.specification) {
      product.specification = req.body.specification;
    }
    if (req.body?.category) {
      product.category = req.body.category;
    }
    if (req.body?.name) {
      product.name = req.body.name;
    }
    if (req?.files.length > 0) {
      await uploadImages(req.files, next, res, product, "edit");
      return;
    }
    await product.save();
    // send response
    return res.status(200).json({ status: "success", data: product });
  } catch (e) {
    console.log(e);
    return next(new AppError(e.message, 500, "error"));
  }
};

// find products
const findProducts = async (req, res, next) => {
  try {
    let queryObj = { ...req.query };
    const excludedFields = ["sort", "select", "limit", "page"];
    excludedFields.forEach((field) => delete queryObj[field]);

    // find and replace certain strings in the query
    let queryStr;
    queryStr = JSON.stringify(queryObj).replace(
      /(gt|lt|lte|gte)/,
      (str) => `$${str}`
    );
    queryObj = JSON.parse(queryStr);

    // create query
    let query = Product.find(queryObj);

    if (req.query.select) {
      const selectStr = req.query.select.split(",").join(" ");
      query = query.select(selectStr);
    }
    if (req.query.sort) {
      const sortStr = req.query.sort.split(",").join(" ");
      query = query.sort(sortStr);
    }
    if (req.query.limit) query = query.limit(+req.query.limit);
    if (req.query.page && req.query.limit) {
      const skipCount = (req.query.page - 1) * 5;
      query = query.skip(skipCount).limit(+req.query.limit);
    }

    // find products
    const products = await query;

    // send response
    return res.status(200).json({
      status: "success",
      results: products.length,
      data: products,
    });
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

// find product
const findProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    // find product
    const product = await Product.findById(productId);

    // no product
    if (!product) return next(new AppError("Not found...", 404, "fail"));

    // send response
    return res.status(200).json({ status: "success", data: product });
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

// delete product
const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product)
      return next(new AppError("Product doesn't exist!", 404, "error"));

    const order = await Order.find({ products: productId, fulfilled: false });
    if (order.length > 0)
      return next(
        new AppError("Fulfill the order for this product first!", 400, "Fail")
      );

    product.deleted = true;
    await product.save();
    return res
      .status(204)
      .json({ status: "success", message: "product deleted" });
  } catch (e) {
    return next(new AppError(e.message, 500, "error"));
  }
};

// featured products
const findFeaturedProducts = async (req, res, next) => {
  req.query.sort = "-price";
  req.query.limit = "4";
  next();
};

// latest arrivals
const latestArrivals = async (req, res, next) => {
  req.query.sort = "-createdAt";
  req.query.limit = "4";
  next();
};

module.exports = {
  addProduct,
  editProduct,
  findProducts,
  deleteProduct,
  findProduct,
  findFeaturedProducts,
  latestArrivals,
};
